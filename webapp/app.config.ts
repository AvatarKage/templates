/* 
————————————————————————————————————————————————————————————————
This and ./env are the ONLY config files you should be edting. 
The rest are either importing this file or updated via the sync 
command. When the translate command is ran the metadata.locale 
file will be translated to all generation.translations.

DO NOT EDIT THE FOLLOWING FILES:
- ./package.json
- ./dev.ecosystem.config.cjs
- ./ecosystem.config.cjs
- ./eslint.config.js
- ./tsconfig.json
- ./vite.config.ts
- ./src/backend/vite.ts
- ./public/manifest.json
- ./src-tauri/Cargo.toml
- ./src-tauri/tauri.conf.json
- ./inno.iss

———————————————————————————————————————————————————————————————— 
QUICK CONFIG
———————————————————————————————————————————————————————————————— 
*/

// Disables Vite, unsafe SSL, and dev domains
const isProduction = false;

// version name is editable in ./src/assets/locales/*.json
const semver = "0.0.1"; // major.minor.patch
const stage = "prealpha"; // prealpha | alpha | beta | rc | release
const build = "5f67b68"; // DO NOT TOUCH, AUTO-GENERATED
const buildDate = "2026-05-05T00:47:50.358Z"; // DO NOT TOUCH, AUTO-GENERATED

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
            main: false,
            status: false,
            api: false,
            cdn: false,
            support: false
        }
    },

    // Displays the maintenance landing
    maintenance: {
        isEnabled: false
        // reason is editable in ./src/assets/locales/*.json
    },

    theme: {
        primary: "#080808",
        accent: "#7b22fd"
    },

    metadata: {
        id: "com.example.project",
        name: "My App",
        // tagline is editable in ./src/assets/locales/*.json
        // description is editable in ./src/assets/locales/*.json
        // keywords are editable in ./src/assets/locales/*.json
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

        // Relative to the ./src/assets folder
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

    // The maximum memory before the server restarts (###M/G)
    memory: {
        proxy: isProduction ? "100M" : "1G",
        main: isProduction ? "350M" : "1G",
        status: isProduction ? "100M" : "1G",
        api: isProduction ? "300M" : "1G",
        cdn: isProduction ? "150M" : "1G",
        support: isProduction ? "350M" : "1G",
        discord_client: isProduction ? "150M" : "1G"
    },

    // Port numbers on localhost (default: 1052* and 3955*)
    ports: {
        // proxy is fixed at 443
        main: 10521,
        status: 10522,
        api: 10523,
        cdn: 10524,
        support: 10525,
        ws: {
            main: 39551,
            support: 39555
        }
    },

    // IP addresses assigned to each server
    ips: {
        main: isProduction ? "127.0.0.0" : "127.0.0.0",
        status: isProduction ? "127.0.0.0" : "127.0.0.0",
        api: isProduction ? "127.0.0.0" : "127.0.0.0",
        cdn: isProduction ? "127.0.0.0" : "127.0.0.0",
        support: isProduction ? "127.0.0.0" : "127.0.0.0"
    },

    // Domains assigned to each server
    domains: {
        main: isProduction ? "prod.example.com" : "dev.example.com",
        status: isProduction ? "status.prod.example.com" : "status.dev.example.com",
        api: isProduction ? "api.prod.example.com" : "api.dev.example.com",
        cdn: isProduction ? "cdn.prod.example.com" : "cdn.dev.example.com",
        support: isProduction ? "support.prod.example.com" : "support.dev.example.com"
    },

    // Third-party applications
    integrations: {
        discord: {
            status: "Example status",
            module: {
                utilities: true
            },
            guild: {
                id: "00000000000000000"
            },
            channels: {
                commands: "00000000000000000",
                commandsDev: "00000000000000000"
            }
        }
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
        sql: resolve(dir, "src", "backend", "api", "sql"),
        public: resolve(dir, "public"),
        commands: resolve(dir, "src", "integrations", "discord", "commands")
    }
} as const;

export type Config = typeof config;