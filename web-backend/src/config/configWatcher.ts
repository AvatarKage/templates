import fs from "fs";
import cron from "node-cron";
import toml from "toml";
import { CronExpressionParser } from "cron-parser";

import parseDuration from "../helpers/parseDuration.js";
import { config } from "./readConfig.js";

const configPath = "./config/config.toml";

function loadConfig(): any {
    const raw = fs.readFileSync(configPath, "utf-8");
    return toml.parse(raw);
}

function patchTomlFile(updates: Record<string, any>) {
    let raw = fs.readFileSync(configPath, "utf-8");

    for (const [path, value] of Object.entries(updates)) {
        const [section, key] = path.split(".");

        const sectionRegex = new RegExp(
            `(\\[${section}\\][\\s\\S]*?)(?=\\n\\[|$)`
        );

        raw = raw.replace(sectionRegex, (block) => {
            const keyRegex = new RegExp(
                `(${key}\\s*=\\s*).*`
            );

            if (typeof value === "string") {
                return block.replace(keyRegex, `$1"${value}"`);
            }

            if (Array.isArray(value)) {
                return block.replace(
                    keyRegex,
                    `$1[${value.map(v => JSON.stringify(v)).join(", ")}]`
                );
            }

            return block.replace(keyRegex, `$1${value}`);
        });
    }

    fs.writeFileSync(configPath, raw, "utf-8");
}

function updateConfig(config: any) {
    const synced = checkForUpdates(config);

    patchTomlFile({
        "maintenance.isEnabled": synced.maintenance.isEnabled,
        "maintenance.endsAt": synced.maintenance.endsAt,
        "announcement.isEnabled": synced.announcement.isEnabled,
    });

    return synced;
}

function checkForUpdates(config: any) {
    const now = new Date();

    const m = config.maintenance;

    if (m.endsAt && new Date(m.endsAt) < now) {
        m.isEnabled = false;
    }

    if (m.endsAt && new Date(m.endsAt) > now) {
        m.isEnabled = true;
    }

    const a = config.announcement;

    if (a.endsAt && new Date(a.endsAt) < now) {
        a.isEnabled = false;
    }

    if (
        a.startsAt &&
        a.endsAt &&
        new Date(a.startsAt) <= now &&
        new Date(a.endsAt) > now
    ) {
        a.isEnabled = true;
    }

    return config;
}

export function isCurrentlyScheduledMaintenance(): boolean {
    const s = config.maintenance.scheduled;
    if (!s?.interval || !s?.duration) return false;

    const now = new Date();

    try {
        const interval = CronExpressionParser.parse(s.interval, {
            currentDate: now
        });

        const prev = interval.prev().toDate();
        const durationMs = parseDuration(s.duration);
        const end = new Date(prev.getTime() + durationMs);

        return now >= prev && now <= end;
    } catch {
        return false;
    }
}

function registerMaintenanceScheduler(config: any) {
    const interval = config.maintenance.scheduled?.interval;
    const duration = config.maintenance.scheduled?.duration;

    if (!interval || !duration) return;

    cron.schedule(interval, () => {
        const durationMs = parseDuration(duration);
        const end = new Date(Date.now() + durationMs);

        config.maintenance.isEnabled = true;
        config.maintenance.endsAt = end.toISOString();

        updateConfig(config);

        setTimeout(() => {
            config.maintenance.isEnabled = false;
            updateConfig(config);
        }, durationMs);
    });
}

export function startConfigWatcher() {
    let config = loadConfig();

    config = updateConfig(config);

    setInterval(() => {
        config = loadConfig();
        config = updateConfig(config);
    }, 60000);

    registerMaintenanceScheduler(config);
}