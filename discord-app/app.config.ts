/* 
————————————————————————————————————————————————————————————————
This and ./env are the ONLY config files you should be edting. 
The rest are either importing this file or updated via the sync 
command. When the translate command is ran the metadata.locale 
file will be translated to all generation.translations.

DO NOT EDIT THE FOLLOWING FILES:
- ./package.json
- ./eslint.config.js
- ./tsconfig.json

———————————————————————————————————————————————————————————————— 
QUICK CONFIG
———————————————————————————————————————————————————————————————— 
*/

// Disables unsafe SSL and dev client
const isProduction = false;

// version name is editable in ./assets/locales/*.json
const semver = "0.0.1"; // major.minor.patch
const stage = "prealpha"; // prealpha | alpha | beta | rc | release
const build = "789578f"; // DO NOT TOUCH, AUTO-GENERATED
const buildDate = "2026-05-04T17:45:50.544Z"; // DO NOT TOUCH, AUTO-GENERATED

/* 
————————————————————————————————————————————————————————————————
FULL CONFIG
———————————————————————————————————————————————————————————————— 
*/

import { fileURLToPath } from "url";
import path, { resolve } from "path";

const dir = path.dirname(fileURLToPath(import.meta.url));

export const config = {
    isProduction,

    // https://nerdfonts.com
    useNerdFonts: true,

    // Sends debug logs
    debug: {
        config: false,
        snowflake: false,

        // Save all logs to file
        logger: {
            main: false
        }
    },

    // Enable or disable modules
    module: {
        utilities: true
    },

    client: {
        presence: {
            status: "dnd", // online | idle | dnd | invisible
            activity: {
                type: "Watching", // Playing | Streaming | Listening | Watching | Competing
                text: "Watching over AvatarKage",
            }
        },
        guild: {
            id: "00000000000000000"
        },
        channels: {
            commands: "00000000000000000",
            commandsDev: "00000000000000000"
        }
    },

    theme: {
        primary: "#080808",
        accent: "#7b22fd"
    },

    metadata: {
        id: "com.example.project",
        name: "My App",
        // tagline is editable in ./assets/locales/*.json
        // description is editable in ./assets/locales/*.json
        // keywords are editable in ./assets/locales/*.json
        theme: "system", // dark | light | system
        locale: "en",
        urls: [
            "https://example.com"
        ],

        version: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            full: `${stage === "release" ? semver : [semver, stage, build].filter(Boolean).join("-")}`,
            semver,
            stage,
            build,
            buildDate
        },

        // Relative to the ./assets folder
        assets: {
            logo: "/branding/logo.svg",
            icon: "/branding/icon.svg",
            banner: "/branding/banner.png"
        },

        legal: {
            owner: "Example, LLC.", // Include suffix for registered entity
            license: {
                text: "Copyright (c) 2026 Example, LLC. All Rights Reserved.", // https://choosealicense.com
                code: "ARR", // https://choosealicense.com
            },
            trademarks: [] // Include ™ or (TM) for trademarks, OR ® or (R) for registered trademarks
        },

        contact: {
            support: "support@example.com",
            legal: "legal@example.com"
        }
    },

    // Identification sent to servers crawled
    crawler: {
        name: "Example",
        version: "1.0",
        website: "https://example.com",
        contact: "admin@example.com"
    },

    // Dynamic generation (snowflake, etc.)
    generation: {
        machine: 0, // (valid: 0–1023)
        epoch: "2026-01-01T00:00:00.000Z",
        seed: "",
        translations: [
            // Do not include metadata.locale from ./app.client.config.ts
            // Supports standard and/or localized
            // e.g., es and/or es-MX
            "zh", // Chinese
            "es", // Spanish
            "hi", // Hindi
            "ar", // Arabic
            "ru", // Russian
            "id", // Indonesian
            "ja" // Japanese
        ]
    },

    folders: {
        root: resolve(dir),
        logs: resolve(dir, "logs"),
        data: resolve(dir, "data"),
        backups: resolve(dir, "backups"),
        sql: resolve(dir, "src", "sql"),
        assets: resolve(dir, "assets"),
        commands: resolve(dir, "src", "commands")
    }
} as const;

export type Config = typeof config;