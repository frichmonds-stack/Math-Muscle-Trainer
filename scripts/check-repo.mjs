// Node port of check-repo.ps1 for environments without PowerShell (cloud sessions).
// Keep the checks in step with check-repo.ps1. Run: node scripts/check-repo.mjs
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function addFailure(message) {
  failures.push(message);
  console.log(`FAIL ${message}`);
}

function readText(relativePath) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

function fileHash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function compareVersions(left, right) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const difference = (leftParts[index] || 0) - (rightParts[index] || 0);
    if (difference) {
      return difference;
    }
  }
  return 0;
}

function getAppVersion() {
  const match = readText("js/app-core.js").match(/const\s+APP_VERSION\s*=\s*"v?(\d+\.\d+\.\d+)"/);
  if (!match) {
    addFailure("Could not find APP_VERSION in js/app-core.js.");
    return null;
  }
  return match[1];
}

const indexLines = readText("index.html").split(/\r?\n/);

const idLines = new Map();
indexLines.forEach((line, lineIndex) => {
  for (const match of line.matchAll(/id="([^"]+)"/g)) {
    const lines = idLines.get(match[1]) || [];
    lines.push(lineIndex + 1);
    idLines.set(match[1], lines);
  }
});
for (const [id, lines] of idLines) {
  if (lines.length > 1) {
    addFailure(`Duplicate id '${id}' in index.html on lines ${lines.join(", ")}.`);
  }
}

for (const line of indexLines) {
  for (const match of line.matchAll(/<script src="([^"]+)"/g)) {
    if (!existsSync(join(repoRoot, match[1]))) {
      addFailure(`Missing script referenced from index.html: ${match[1]}.`);
    }
  }
}

const jsFiles = readdirSync(join(repoRoot, "js"))
  .filter((name) => name.endsWith(".js"))
  .sort();
const cssFiles = readdirSync(join(repoRoot, "css"))
  .filter((name) => name.endsWith(".css"))
  .sort()
  .map((name) => `css/${name}`);
const styleRefs = indexLines.flatMap((line) =>
  Array.from(line.matchAll(/<link rel="stylesheet" href="(css\/[^"]+)"/g), (match) => match[1]),
);
if (styleRefs.join("|") !== cssFiles.join("|")) {
  addFailure("index.html stylesheet links must list every css/*.css file in name order.");
}
const jsText = jsFiles.map((name) => readText(`js/${name}`)).join("\n");

const removedHelpers = ["applySettingsToForm"];
for (const helper of removedHelpers) {
  if (new RegExp(`\\b${helper}\\s*\\(`).test(jsText)) {
    addFailure(`Removed helper still referenced: ${helper}.`);
  }
}

// PowerShell's -notcontains is case-insensitive, so compare lowercased names.
const functionNames = new Set(
  Array.from(jsText.matchAll(/^\s*function\s+([A-Za-z_$][\w$]*)\s*\(/gm), (match) => match[1].toLowerCase()),
);
const projectCallPattern =
  /^(apply|render|start|handle|get|set|sync|reset|create|build|update|format|normalise|sanitise|read|show|open|close|request|toggle|shift|load|save|queue|complete|register|infer|parse|calculate|compare|compact|prune|mark|advance|retreat|jump|begin|move|submit|evaluate|randomise|append|write)/;
const undefinedProjectCalls = Array.from(
  new Set(Array.from(jsText.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g), (match) => match[1])),
)
  .filter((name) => projectCallPattern.test(name) && !functionNames.has(name.toLowerCase()))
  .sort();
if (undefinedProjectCalls.length) {
  addFailure(`Possible undefined project function call(s): ${undefinedProjectCalls.join(", ")}.`);
}

const appVersion = getAppVersion();
const releasedVersions = Array.from(readText("CHANGELOG.md").matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm), (match) => match[1]);
if (!releasedVersions.length) {
  addFailure("CHANGELOG.md has no released semantic version headings.");
} else if (appVersion) {
  const latestChangelogVersion = releasedVersions.sort(compareVersions).at(-1);
  if (appVersion !== latestChangelogVersion) {
    addFailure(`APP_VERSION v${appVersion} does not match latest CHANGELOG release v${latestChangelogVersion}.`);
  }
}

if (existsSync(join(repoRoot, "docs/index.html"))) {
  const docsIndex = readText("docs/index.html");
  const latestCount = (docsIndex.match(/\(latest\)/g) || []).length;
  if (latestCount !== 1) {
    addFailure(`docs/index.html should contain exactly one '(latest)' marker, found ${latestCount}.`);
  }

  const versionDirs = readdirSync(join(repoRoot, "docs"))
    .filter((name) => /^v\d+$/.test(name) && statSync(join(repoRoot, "docs", name)).isDirectory())
    .sort((left, right) => Number(left.slice(1)) - Number(right.slice(1)));
  const liveDir = join(repoRoot, "docs/live");
  const latestLiveLink = docsIndex.match(/<a href="\.\/live\/">[^<]*\(latest\)/);
  const latestVersionLink = docsIndex.match(/<a href="\.\/(v\d+)\/">[^<]*\(latest\)/);

  if (versionDirs.length && latestVersionLink && latestVersionLink[1] !== versionDirs.at(-1)) {
    addFailure(`docs latest version marker points to ${latestVersionLink[1]}, expected ${versionDirs.at(-1)}.`);
  }

  let latestDir = null;
  if (latestLiveLink) {
    if (!existsSync(liveDir)) {
      addFailure("docs/index.html marks live as latest but docs/live is missing.");
    } else {
      latestDir = liveDir;
    }
  } else if (latestVersionLink && versionDirs.includes(latestVersionLink[1])) {
    latestDir = join(repoRoot, "docs", latestVersionLink[1]);
  } else {
    addFailure("docs/index.html does not mark live or a version link as latest.");
  }

  if (latestDir) {
    const rootFiles = ["index.html", ...cssFiles, ...jsFiles.map((name) => `js/${name}`)];
    for (const relativePath of rootFiles) {
      const docsFile = join(latestDir, relativePath);
      if (!existsSync(docsFile)) {
        addFailure(`Latest docs snapshot is missing ${relativePath}.`);
        continue;
      }
      if (fileHash(join(repoRoot, relativePath)) !== fileHash(docsFile)) {
        addFailure(`Latest docs snapshot differs from root for ${relativePath}.`);
      }
    }
  }
}

if (failures.length) {
  console.log("");
  console.log(`${failures.length} check(s) failed.`);
  process.exit(1);
}

console.log("All repo checks passed.");
