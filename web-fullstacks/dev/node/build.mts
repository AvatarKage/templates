import { execa } from "execa";
import cliProgress from "cli-progress";
import chalk from "chalk";
import { Stopwatch } from "@sapphire/stopwatch";

import { config } from "../../app.config.js";

const sw = new Stopwatch();

const makeSteps = (): [string, string][] => [
    ["Preparing workspace...", "npm run clean"],
    ["Syncing config...", "npm run sync"],
    ["Translating locales...", "npm run translate"],
    ["Compiling Typescript...", "tsc"],
    ["Building frontend...", "vite build"],
    ["Minifying code...", "npm run minify"],

    ...[
        "delete:dist:dev",
        "delete:dist:sandbox",
        "delete:dist:src:types",
        "delete:dist:vite",
    ].map(cmd => ["Cleaning workspace...", `npm run ${cmd}`] as [string, string]),

    ...[
        "copy:ssl",
        "copy:public",
        "copy:package",
        "copy:env",
        "copy:ecosystem",
    ].map(cmd => ["Copying files...", `npm run ${cmd}`] as [string, string]),
];

const steps = makeSteps();

let isDone = false;

const bar = new cliProgress.SingleBar({
    hideCursor: true,
    format: (options, params, payload) => {
        const total = params.total ?? steps.length;
        const current = params.value ?? 0;

        const width = 42;
        const progress = Math.round((current / total) * width);
        const percent = Math.round((current / total) * 100);

        const color = isDone ? chalk.green : chalk.blueBright;

        const filled = color("━".repeat(progress));
        const empty = (isDone ? chalk.green : chalk.white)(
            "━".repeat(width - progress)
        );

        const title = color(
            config.useNerdFonts
                ? (isDone ? "" : "")
                : (isDone ? "[BUILT]" : "[BUILDING]")
        );

        const stepText = color(payload.step);
        const percentText = color(`(${percent}%)`);

        return `${title} ${filled}${empty} ${percentText} ${stepText}`;
    },
});

sw.start();

bar.start(steps.length, 0, { step: "Preparing workspace..." });

for (let i = 0; i < steps.length; i++) {
    const [name, cmd] = steps[i];

    bar.update(i, { step: name });

    try {
        await execa(cmd, {
            shell: true,
            stdio: "ignore",
        });
    } catch (error) {
        bar.stop();
        console.error(`${config.useNerdFonts ? " " : ""}Failed at step: ${name}`);
        throw error;
    }
}

sw.stop();

isDone = true;

bar.update(steps.length, {
    step: `${config.useNerdFonts ? " " : ""}Took ${sw.toString()}`,
});

bar.stop();