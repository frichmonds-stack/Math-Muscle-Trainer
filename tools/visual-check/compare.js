#!/usr/bin/env node
"use strict";
// Pixel-diff two screenshot directories.
// Usage: node compare.js <dirA> <dirB> [--diff-dir=<dir>] [--threshold=0.1]
// Exit code: 0 = identical, 1 = differences (or missing files), 2 = usage error.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");
const pixelmatch = require("pixelmatch");

function main() {
  const args = process.argv.slice(2);
  const opt = (name, def) => { const a = args.find((x) => x.startsWith(`--${name}=`)); return a ? a.slice(name.length + 3) : def; };
  const [dirA, dirB] = args.filter((a) => !a.startsWith("--"));
  if (!dirA || !dirB) { console.error("Usage: node compare.js <dirA> <dirB> [--diff-dir=<dir>] [--threshold=0.1]"); process.exit(2); }
  const diffDir = opt("diff-dir", path.join(dirB, "_diff"));
  const threshold = Number(opt("threshold", "0.1"));
  const list = (d) => new Set(fs.readdirSync(d).filter((f) => f.endsWith(".png")));
  const a = list(dirA); const b = list(dirB);
  const names = [...new Set([...a, ...b])].sort();
  let problems = 0; let same = 0;
  fs.rmSync(diffDir, { recursive: true, force: true });
  for (const name of names) {
    if (!a.has(name) || !b.has(name)) {
      console.log(`MISSING  ${name}  (only in ${a.has(name) ? "A" : "B"})`);
      problems += 1; continue;
    }
    const imgA = PNG.sync.read(fs.readFileSync(path.join(dirA, name)));
    const imgB = PNG.sync.read(fs.readFileSync(path.join(dirB, name)));
    if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
      console.log(`SIZE     ${name}  A=${imgA.width}x${imgA.height} B=${imgB.width}x${imgB.height}`);
      problems += 1; continue;
    }
    const diff = new PNG({ width: imgA.width, height: imgA.height });
    const count = pixelmatch(imgA.data, imgB.data, diff.data, imgA.width, imgA.height, { threshold });
    if (count > 0) {
      fs.mkdirSync(diffDir, { recursive: true });
      fs.writeFileSync(path.join(diffDir, name), PNG.sync.write(diff));
      const pct = ((100 * count) / (imgA.width * imgA.height)).toFixed(3);
      console.log(`DIFF     ${name}  ${count} px (${pct}%)`);
      problems += 1;
    } else {
      same += 1;
    }
  }
  console.log(`\n${same} identical, ${problems} with differences, ${names.length} total.` + (problems ? ` Diff images: ${path.resolve(diffDir)}` : ""));
  process.exit(problems ? 1 : 0);
}
main();
