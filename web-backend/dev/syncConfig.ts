import fs from "fs";
import { execSync } from "child_process";
import tomlParser from "toml";

const tomlPath = "config/config.toml";
let tomlRaw = fs.readFileSync(tomlPath, "utf8");

const toml = tomlParser.parse(tomlRaw);

if (!toml.metadata.name) throw new Error("config.toml is missing name");
if (!toml.metadata.version.semver) throw new Error("config.toml is missing semver");
if (!toml.metadata.version.stage) throw new Error("config.toml is missing stage");
if (!toml.metadata.legal.license) throw new Error("config.toml is missing license");

const name = toml.metadata.name;
const semver = toml.metadata.version.semver;
const stage = toml.metadata.version.stage;
const license = toml.metadata.legal.license;

let hash;
try {
  hash = execSync("git rev-parse --short HEAD").toString().trim();
} catch {
  hash = Date.now().toString().slice(-5);
}

const fullVersion =
  stage === "release"
    ? `${semver}`
    : `${semver}-${stage}-${hash}`;

// config.toml
let updatedToml = tomlRaw;

updatedToml = updatedToml.replace(
  /build\s*=\s*".*?"/,
  `build = "${hash}"`
);

updatedToml = updatedToml.replace(
  /buildDate\s*=\s*".*?"/,
  `buildDate = "${new Date().toISOString()}"`
);

fs.writeFileSync(tomlPath, updatedToml);

// package.json
const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const banner = `/* This file is part of ${name}. ${license} */`;

pkg.name = name.toLowerCase();
pkg.version = fullVersion;
pkg.license = license;
pkg.scripts.minify = `npx esbuild "dist/**/*.js" --format=esm --minify --banner:js="${banner}" --outdir=dist --allow-overwrite`;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`New version: v${fullVersion}`);

// *.ecosystem.config.cjs
const ecosystemFiles = [
  "ecosystem.config.cjs",
  "dev.ecosystem.config.cjs"
];

function updateEcosystem(filePath: fs.PathOrFileDescriptor) {
  let file = fs.readFileSync(filePath, "utf8");

  const apps = toml.memory || {};

  for (const [appName, memValue] of Object.entries(apps)) {
    if (!memValue) continue;

    const regex = new RegExp(
      `(name:\\s*["']${appName}["'][\\s\\S]*?max_memory_restart:\\s*)["'][^"']*["']`,
      "g"
    );

    file = file.replace(regex, `$1"${memValue}"`);
  }

  fs.writeFileSync(filePath, file);
}

ecosystemFiles.forEach(updateEcosystem);