import { execa } from "execa";
import cliProgress from "cli-progress";
import chalk from "chalk";
import { Stopwatch } from "@sapphire/stopwatch";

import { config } from "../../app.config.js";

const sw = new Stopwatch();

const makeSteps = (): [string, string][] => [
    ["Downloading modules...", "npm install"],
    ["Downloading modules...", "npm install -g pm2"],
    ["Downloading modules...", "npm update"],
    ["Downloading modules...", "git clone --depth=1 --filter=blob:none --sparse https://github.com/AvatarKage/kage-library tmp-kage-library "],
    ["Copying files...", "cd tmp-kage-library"],
    ["Copying files...", "git sparse-checkout set typescript"],
    ["Copying files...", "cd .."],
    ["Copying files...", "cpx \"tmp-kage-library/typescript/**/*\" src/ "],
    ["Cleaning workspace...", "rimraf tmp-kage-library"],
    ["Cleaning workspace...", "shx mv .env.example .env"],
    ["Cleaning workspace...", "rimraf --glob \"**/DELETE_ME\""]
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
                : (isDone ? "[READY]" : "[UPDATING]")
        );

        const stepText = color(payload.step);
        const percentText = color(`(${percent}%)`);

        return `${title} ${filled}${empty} ${percentText} ${stepText}`;
    },
});

sw.start();

bar.start(steps.length, 0, { step: "Downloading modules..." });

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