import { execa } from "execa";
import cliProgress from "cli-progress";
import chalk from "chalk";
import { Stopwatch } from "@sapphire/stopwatch";
import path from "node:path";
import fs from "node:fs";

import { config } from "../../app.config.js";

const sw = new Stopwatch();

const ROOT = process.cwd();
const TMP_DIR = path.join(ROOT, "tmp-kage-library");

if (!fs.existsSync(path.join(ROOT, "package.json"))) {
    throw new Error("Blocked attempt to run outside project root");
}

const run = (cmd: string, args: string[] = [], options: any = {}) =>
    execa(cmd, args, {
        stdio: "pipe",
        ...options,
    });

const steps = [
    {
        name: "Downloading dependencies...",
        run: () => run("npm", ["install"]),
    },
    {
        name: "Downloading dependencies...",
        run: () => run("npm", ["install", "-g", "pm2"]),
    },
    {
        name: "Downloading dependencies...",
        run: () => run("npm", ["update"]),
    },
    {
        name: "Downloading dependencies...",
        run: async () => {
            if (fs.existsSync(TMP_DIR)) {
                await run("rimraf", [TMP_DIR]);
            }

            await run("git", [
                "clone",
                "--depth=1",
                "--filter=blob:none",
                "--sparse",
                "https://github.com/AvatarKage/kage-library",
                TMP_DIR,
            ]);
        },
    },
    {
        name: "Copying files...",
        run: () =>
            run(
                "git",
                ["sparse-checkout", "set", "typescript"],
                { cwd: TMP_DIR }
            ),
    },
    {
        name: "Copying files...",
        run: () =>
            run(
                "cpx",
                ["typescript/**/*", path.join(ROOT, "src")],
                { cwd: TMP_DIR }
            ),
    },
    {
        name: "Cleaning workspace...",
        run: async () => {
            if (fs.existsSync(TMP_DIR)) {
                await run("rimraf", [TMP_DIR]);
            }
        },
    },
];

let isDone = false;

const bar = new cliProgress.SingleBar({
    hideCursor: true,
    format: (_, params, payload) => {
        const total = params.total ?? steps.length;
        const current = params.value ?? 0;

        const width = 42;
        const progress = Math.round((current / total) * width);
        const percent = Math.round((current / total) * 100);

        const color = isDone ? chalk.green : chalk.blueBright;

        return `${color(config.useNerdFonts ? (isDone ? "" : "") : (isDone ? "[READY]" : "[UPDATING]"))} ` +
            `${color("━".repeat(progress))}${chalk.white("━".repeat(width - progress))} ` +
            `${color(`(${percent}%)`)} ${color(payload.step)}`;
    },
});

sw.start();

bar.start(steps.length, 0, { step: "Starting..." });

for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    bar.update(i, { step: step.name });

    try {
        await step.run();
    } catch (error: any) {
        bar.stop();

        console.error(
            `${config.useNerdFonts ? " " : ""}Failed at step: ${step.name}`
        );

        if (error.stdout) console.error("\nSTDOUT:\n" + error.stdout);
        if (error.stderr) console.error("\nSTDERR:\n" + error.stderr);

        process.exit(1);
    }
}

sw.stop();

isDone = true;

bar.update(steps.length, {
    step: `${config.useNerdFonts ? " " : ""}Took ${sw.toString()}`,
});

bar.stop();