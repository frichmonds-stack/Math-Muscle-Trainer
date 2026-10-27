#!/usr/bin/env node
"use strict";
// Review sheet: one HTML page laying out every captured screen at every viewport side by side,
// with the fit checker's result under each screenshot when a fit report is given.
// Usage: node sheet.js <captureDir> [--fit=fit-report.json] [--out=file.html]
// Default output: <captureDir>/index.html (image links are relative, so keep it beside the PNGs).
const fs = require("fs");
const path = require("path");
const { VIEWPORTS } = require("./lib/viewports");

const FILE_PATTERN = /^(.+?)__(.+?)__(.+?)__(.+)-p(\d+)\.png$/;

const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

function readShots(dir) {
  const shots = new Map(); // "state|vp|mode|screen" -> [file, ...] in tile order
  const seen = { states: new Set(), viewports: new Set(), modes: new Set(), screens: new Set() };
  for (const file of fs.readdirSync(dir).sort()) {
    const m = file.match(FILE_PATTERN);
    if (!m) continue;
    const [, st, vp, mode, screen, tile] = m;
    const key = [st, vp, mode, screen].join("|");
    if (!shots.has(key)) shots.set(key, []);
    shots.get(key)[Number(tile) - 1] = file;
    seen.states.add(st); seen.viewports.add(vp); seen.modes.add(mode); seen.screens.add(screen);
  }
  return { shots, seen };
}

function fitIndex(report) {
  const index = new Map(); // "state|vp|screen" -> { coverage, issues }
  for (const combo of report?.results || []) {
    for (const s of combo.screens) index.set([combo.state, combo.viewport, s.screen].join("|"), s);
  }
  return index;
}

function fitBadge(result) {
  if (!result) return "";
  const fails = result.issues.filter((i) => i.severity === "fail");
  const warns = result.issues.filter((i) => i.severity === "warn");
  const cls = fails.length ? "fail" : warns.length ? "warn" : "ok";
  const label = fails.length ? `${fails.length} fail` : "fits";
  const extra = [warns.length ? `${warns.length} warn` : "", `uses ${result.coverage}% of screen`].filter(Boolean).join(" · ");
  if (!result.issues.length) return `<div class="fit ${cls}"><b>${label}</b> <span>${esc(extra)}</span></div>`;
  const rows = [...fails, ...warns]
    .map((i) => `<li class="${i.severity}"><b>${esc(i.rule)}</b> ${esc(i.element)}<br><span>${esc(i.detail)}</span></li>`)
    .join("");
  return `<details class="fit ${cls}"><summary><b>${label}</b> <span>${esc(extra)}</span></summary><ul>${rows}</ul></details>`;
}

function build(dir, report) {
  const { shots, seen } = readShots(dir);
  const fit = fitIndex(report);
  const viewports = Object.keys(VIEWPORTS).filter((v) => seen.viewports.has(v));
  const screens = [...seen.screens].sort();
  const states = [...seen.states].sort();
  const modes = [...seen.modes].sort();
  const views = [];
  for (const st of states) {
    for (const mode of modes) {
      const head = viewports.map((v) => {
        const vp = VIEWPORTS[v];
        return `<th>${esc(vp.label)}<small>${vp.width}x${vp.height}${vp.touch ? " touch" : ""}</small></th>`;
      }).join("");
      const rows = screens.map((screen) => {
        const cells = viewports.map((v) => {
          const files = shots.get([st, v, mode, screen].join("|")) || [];
          const imgs = files.filter(Boolean)
            .map((f) => `<a href="${esc(f)}" target="_blank"><img loading="lazy" src="${esc(f)}" alt="${esc(f)}"></a>`).join("");
          return `<td>${imgs || '<p class="none">not captured</p>'}${fitBadge(fit.get([st, v, screen].join("|")))}</td>`;
        }).join("");
        return `<tr><th class="screen">${esc(screen)}</th>${cells}</tr>`;
      }).join("");
      views.push(`<table data-view="${esc(st)}|${esc(mode)}"><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table>`);
    }
  }
  const options = (list) => list.map((x) => `<option>${esc(x)}</option>`).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Screen review</title>
<style>
  :root { color-scheme: dark; --bg: #111; --panel: #1b1b1b; --line: #333; --text: #eee; --muted: #999;
    --ok: #7ce1a6; --warn: #ffd55f; --fail: #ff6a6a; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.4 system-ui, sans-serif; }
  header { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
    padding: 10px 16px; background: var(--panel); border-bottom: 1px solid var(--line); }
  header h1 { margin: 0 12px 0 0; font-size: 16px; }
  header label { display: flex; gap: 6px; align-items: center; }
  header p { margin: 0; color: var(--muted); }
  .wrap { overflow-x: auto; padding: 0 16px 24px; }
  table { border-collapse: collapse; }
  table[hidden] { display: none; }
  th, td { padding: 8px; border-bottom: 1px solid var(--line); vertical-align: top; text-align: left; }
  thead th { position: sticky; top: 52px; background: var(--bg); z-index: 1; white-space: nowrap; }
  thead small { display: block; color: var(--muted); font-weight: normal; }
  th.screen { position: sticky; left: 0; background: var(--bg); white-space: nowrap; }
  td img { display: block; height: 240px; width: auto; margin-bottom: 4px; border: 1px solid var(--line); }
  .none { color: var(--muted); }
  .fit { max-width: 300px; font-size: 12px; }
  .fit summary { cursor: pointer; }
  .fit span { color: var(--muted); }
  .fit.ok b { color: var(--ok); } .fit.warn b { color: var(--warn); } .fit.fail b { color: var(--fail); }
  .fit ul { margin: 4px 0 0; padding-left: 16px; max-height: 260px; overflow-y: auto; }
  .fit li.fail b { color: var(--fail); } .fit li.warn b { color: var(--warn); }
</style></head>
<body>
<header>
  <h1>Screen review</h1>
  <label>Data <select id="state">${options(states)}</select></label>
  <label>Mode <select id="mode">${options(modes)}</select></label>
  <p>${report ? "Fit results are measured in dark mode and shown for both modes." : "No fit report given (run fit.js and pass --fit=)."} Click a screenshot for full size.</p>
</header>
<div class="wrap">${views.join("\n")}</div>
<script>
  const pick = () => {
    const key = document.getElementById("state").value + "|" + document.getElementById("mode").value;
    document.querySelectorAll("table[data-view]").forEach((t) => { t.hidden = t.dataset.view !== key; });
  };
  document.querySelectorAll("header select").forEach((s) => s.addEventListener("change", pick));
  pick();
</script>
</body></html>
`;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = (name) => (args.find((a) => a.startsWith(`--${name}=`)) || "").slice(name.length + 3) || null;
  const [dir] = args.filter((a) => !a.startsWith("--"));
  if (!dir) { console.error("Usage: node sheet.js <captureDir> [--fit=fit-report.json] [--out=file.html]"); process.exit(2); }
  const fitPath = opt("fit");
  const report = fitPath ? JSON.parse(fs.readFileSync(fitPath, "utf8")) : null;
  const out = opt("out") || path.join(dir, "index.html");
  fs.writeFileSync(out, build(dir, report));
  console.log(`Review sheet: ${path.resolve(out)}`);
}

module.exports = { build };
