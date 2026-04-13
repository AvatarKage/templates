import fs from "fs";
import { execSync } from "child_process";

const tomlPath = "config/config.toml";
let toml = fs.readFileSync(tomlPath, "utf8");

const nameMatch = toml.match(/name\s*=\s*"(.*?)"/);
const semverMatch = toml.match(/semver\s*=\s*"(.*?)"/);
const stageMatch = toml.match(/stage\s*=\s*"(.*?)"/);
const licenseMatch = toml.match(/license\s*=\s*"(.*?)"/);

if (!nameMatch) throw new Error("config.toml is missing name");
if (!semverMatch) throw new Error("config.toml is missing semver");
if (!stageMatch) throw new Error("config.toml is missing stage");
if (!licenseMatch) throw new Error("config.toml is missing license");

const name = nameMatch[1];
const semver = semverMatch[1];
const stage = stageMatch[1];
const license = licenseMatch[1];

let hash;
try {
    hash = execSync("git rev-parse --short HEAD").toString().trim();
} catch {
    hash = Date.now().toString().slice(-5);
}

const fullVersion = `${stage === "release" ? `${semver}` : `${semver}-${stage}-${hash}`}`;

// config.toml
toml = toml.replace(
    /build\s*=\s*".*?"/,
    `build = "${hash}"`
);

toml = toml.replace(
    /buildDate\s*=\s*".*?"/,
    `buildDate = "${new Date().toISOString()}"`
);

fs.writeFileSync(tomlPath, toml);

// package.json
const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

pkg.name = name.toLowerCase();
pkg.version = fullVersion;
pkg.license = license;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`New version: v${fullVersion}`)