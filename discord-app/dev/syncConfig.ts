import { randomBytes } from "crypto";
import path from "path";
import fs from "fs";

import { 
    I18nService
} from "kage-library";

import { config } from "../app.config.js";


const i18n = await I18nService.load(
    { 
        localesPath: "/public/locales", 
        locale: "en", 
        defaultLocale: config.metadata.locale 
    }
);

const primary = config.theme.primary;
const accent = config.theme.accent;
const name = config.metadata.name;
const semver = config.metadata.version.semver;
const stage = config.metadata.version.stage;
const fullVersion = config.metadata.version.full;
const icon = config.metadata.assets.icon;
const owner = config.metadata.legal.owner;
const licenseText = config.metadata.legal.license.text;
const licenseCode = config.metadata.legal.license.code;
const keywords = (i18n.t("metadata.keywords") || "")
  .split(",")
  .map(k => k.trim())
  .filter(Boolean);

if (!primary) throw new Error("app.config.js is missing theme.primary");
if (!accent) throw new Error("app.config.js is missing theme.accent");
if (!name) throw new Error("app.config.js is missing metadata.name");
if (!semver) throw new Error("app.config.js is missing metadata.version.semver");
if (!stage) throw new Error("app.config.js is missing metadata.version.stage");
if (!fullVersion) throw new Error("app.config.js is missing metadata.version.full");
if (!icon) throw new Error("app.config.js is missing metadata.assets.icon");
if (!owner) throw new Error("app.config.js is missing metadata.legal.owner");
if (!licenseText) throw new Error("app.config.js is missing metadata.legal.license.text");
if (!licenseCode) throw new Error("app.config.js is missing metadata.legal.license.code");

/* 
————————————————————————————————————————————————————————————————
app.config.js
———————————————————————————————————————————————————————————————— 
*/

const configPath = path.join(config.folders.root, "app.config.ts");
let rawConfig = fs.readFileSync(configPath, "utf8");

rawConfig = rawConfig.replace(
    /const\s+build\s*=\s*".*?"/,
    `const build = "build-${randomBytes(4).toString("hex").slice(0, 7)}"`
);

rawConfig = rawConfig.replace(
    /const\s+buildDate\s*=\s*".*?"/,
    `const buildDate = "${new Date().toISOString()}"`
);

fs.writeFileSync(configPath, rawConfig, "utf8");

/* 
————————————————————————————————————————————————————————————————
package.json
———————————————————————————————————————————————————————————————— 
*/

const packagePath = path.join(config.folders.root, "package.json");
const packageJSON = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const headerText = `This file is part of ${name}. ${licenseText}`;

packageJSON.name = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
    
packageJSON.version = fullVersion;
packageJSON.description = i18n.t("metadata.description");
packageJSON.keywords = keywords;
packageJSON.author = owner;
packageJSON.license = licenseCode;
packageJSON.scripts.minify = `npx esbuild "dist/**/*.js" --format=esm --minify --banner:js="/* ${headerText} */" --outdir=dist --allow-overwrite`;

fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2), "utf8");