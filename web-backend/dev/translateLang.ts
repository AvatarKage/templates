import fs from "fs";
import path from "path";
import translate from "translate";

import { parseLang } from "../src/config/getLang.js";
import { config } from "../src/config/readConfig.js";

translate.engine = "google";

const translations = config.generation.translations as readonly string[];
const cache = new Map<string, string>();

type Lang = (typeof translations)[number];
type Path = string[];

function clone(obj: any): any {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(clone);

    const res: any = {};
    for (const k in obj) res[k] = clone(obj[k]);
    return res;
}

function extract(obj: any, path: Path = [], out: any[] = []) {
    if (typeof obj !== "object" || obj === null) return out;

    if (Array.isArray(obj)) {
        obj.forEach((v, i) => extract(v, [...path, String(i)], out));
        return out;
    }

    for (const k in obj) {
        const v = obj[k];

        if (typeof v === "string") {
            const t = v.trim();
            if (!t || t === "[]") continue;

            out.push({ path: [...path, k], value: t });
        } else if (typeof v === "object" && v !== null) {
            extract(v, [...path, k], out);
        }
    }

    return out;
}

function set(obj: any, path: Path, value: string) {
    let cur = obj;

    for (let i = 0; i < path.length - 1; i++) {
        cur = cur[path[i]];
    }

    cur[path[path.length - 1]] = value;
}

async function translateAll(value: string, lang: Lang) {
    const key = `${lang}:${value}`;

    if (cache.has(key)) return cache.get(key)!;

    try {
        const res = await translate(value, {
            to: lang.includes("-") ? lang.split("-")[0] : lang
        });

        cache.set(key, res);
        return res;
    } catch {
        return value;
    }
}

function flatten(obj: any, prefix = "", out: string[] = []) {
    if (typeof obj !== "object" || obj === null) return out;

    if (Array.isArray(obj)) {
        out.push(`${prefix} = ${JSON.stringify(obj)}`);
        return out;
    }

    for (const k in obj) {
        const val = obj[k];
        const key = prefix ? `${prefix}.${k}` : k;

        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            flatten(val, key, out);
        } else {
            out.push(`${key} = ${JSON.stringify(val ?? "")}`);
        }
    }

    return out;
}

/**
 * Parses existing .lang file into a Map<flatKey, value>
 */
function parseLangFile(content: string) {
    const map = new Map<string, string>();

    for (const line of content.split("\n")) {
        const idx = line.indexOf("=");
        if (idx === -1) continue;

        const key = line.slice(0, idx).trim();
        let value = line.slice(idx + 1).trim();

        value = value.replace(/^"(.*)"$/, "$1");

        map.set(key, value);
    }

    return map;
}

(async () => {
    const raw: any = parseLang(config.metadata.language);

    const baseStrings = extract(raw);

    for (const lang of translations) {
        const cloned = clone(raw);

        const filePath = path.join("config", "lang", `${lang}.lang`);

        let existing = new Map<string, string>();

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            existing = parseLangFile(fileContent);
        }

        for (const item of baseStrings) {
            const flatKey = item.path.join(".");

            const existingValue = existing.get(flatKey);

            if (existingValue && existingValue.trim() !== "") {
                set(cloned, item.path, existingValue);
                continue;
            }

            const translated = await translateAll(item.value, lang);
            set(cloned, item.path, translated);
        }

        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        fs.writeFileSync(
            filePath,
            flatten(cloned).join("\n"),
            "utf-8"
        );

        console.log(`Saved ${filePath}`);
    }

    console.log("Completed translating lang files");
})();