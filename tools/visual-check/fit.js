#!/usr/bin/env node
"use strict";
// Fit checker: walks every standard screen at every viewport and reports anything that does not
// fit on one screen (page or panel scrolling, off-screen or cut-off content), touch targets below
// the minimum finger size and text below the minimum readable size. Rules: lib/fit-rules.js.
// Usage: node fit.js <appDir> [--out=dir] [--viewport=name,name] [--only=substring]
// Writes <out>/fit-report.json and fit-report.txt (default out/fit). Exit 1 when any screen has a
// FAIL issue; WARN issues (comfortable but not minimum sizes) are reported without failing.
const fs = require("fs");
const path = require("path");
const c = require("./lib/common");
const { openApp, settle, walkScreens, loadDataStates } = require("./lib/app-session");
const { VIEWPORTS, selectViewports } = require("./lib/viewports");
const { RULES, DEFAULT_LIMITS, measureFit } = require("./lib/fit-rules");

// Layout does not depend on colour mode, so fit runs in dark mode only.
const MODE = "dark";

async function checkCombo(browser, origin, stateName, progress, vpName, only) {
  const { ctx, page, errors } = await openApp(browser, origin, { vpName, mode: MODE, progress });
  const screens = [];
  const shot = async (screen, { dialog = false } = {}) => {
    if (only && !`${stateName}__${vpName}__${screen}`.includes(only)) return;
    await settle(page);
    const issues = await page.evaluate(measureFit, {
      touch: VIEWPORTS[vpName].touch, scope: dialog ? "dialog[open]" : null, ...DEFAULT_LIMITS,
    });
    // Share of the screen covered by the app shell (informational: shows a boxed-in layout).
    const coverage = await page.evaluate(() => {
      const r = document.querySelector(".page-shell").getBoundingClientRect();
      const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
      const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      return Math.round((100 * w * h) / (innerWidth * innerHeight));
    });
    screens.push({ screen, coverage, issues });
  };
  await walkScreens(page, shot);
  await ctx.close();
  if (errors.length) console.warn(`  page errors in ${stateName}/${vpName}:\n    ${errors.join("\n    ")}`);
  return screens;
}

const fails = (s) => s.issues.filter((i) => i.severity === "fail");
const warns = (s) => s.issues.filter((i) => i.severity === "warn");

function countByRule(issues) {
  const counts = {};
  for (const i of issues) counts[i.rule] = (counts[i.rule] || 0) + 1;
  return Object.entries(counts).map(([r, n]) => `${r} ${n}`).join(", ");
}

function summarise(results) {
  const L = DEFAULT_LIMITS;
  const lines = ["Fit report. A screen fits when it has no FAIL issues; WARN issues are listed but do not fail.", "", "Rules:"];
  for (const [rule, text] of Object.entries(RULES)) lines.push(`  ${rule.padEnd(13)} ${text}`);
  lines.push(`  Limits: touch targets fail <${L.failTarget}px, warn <${L.warnTarget}px (touch viewports only); ` +
    `text fail <${L.failFont}px, warn <${L.warnFont}px.`, "");
  let total = 0; let failing = 0;
  for (const combo of results.filter((r) => r.screens.length)) {
    const vp = VIEWPORTS[combo.viewport];
    const bad = combo.screens.filter((s) => fails(s).length);
    total += combo.screens.length; failing += bad.length;
    lines.push(`${combo.state} / ${combo.viewport} (${vp.width}x${vp.height}${vp.touch ? ", touch" : ""}): ` +
      `${combo.screens.length - bad.length}/${combo.screens.length} screens fit, ` +
      `app uses ${Math.min(...combo.screens.map((x) => x.coverage))}% of the screen`);
    for (const s of combo.screens) {
      const f = fails(s); const w = warns(s);
      if (!f.length && !w.length) continue;
      const tag = f.length ? "FAIL" : "warn";
      const parts = [f.length ? countByRule(f) : "", w.length ? `(warn: ${countByRule(w)})` : ""].filter(Boolean);
      lines.push(`  ${tag} ${s.screen.padEnd(34)} ${parts.join(" ")}`);
    }
  }
  lines.push("", `${total - failing}/${total} screen checks fit; ${failing} fail. Details: fit-report.json`);
  return { text: lines.join("\n"), failing };
}

async function fit(appDir, outDir, viewportList, only) {
  const viewports = selectViewports(viewportList);
  const dataStates = await loadDataStates(appDir);
  const srv = await c.startServer(appDir);
  const browser = await c.launchBrowser();
  const results = [];
  try {
    for (const [stateName, progress] of dataStates) {
      for (const vpName of viewports) {
        const screens = await checkCombo(browser, srv.origin, stateName, progress, vpName, only);
        console.log(`checked ${String(screens.length).padStart(2)}  ${stateName} / ${vpName}`);
        results.push({ state: stateName, viewport: vpName, screens });
      }
    }
  } finally {
    await browser.close();
    await srv.close();
  }
  fs.mkdirSync(outDir, { recursive: true });
  const report = { limits: DEFAULT_LIMITS, rules: RULES, viewports: VIEWPORTS, results };
  fs.writeFileSync(path.join(outDir, "fit-report.json"), JSON.stringify(report, null, 2));
  const { text, failing } = summarise(results);
  fs.writeFileSync(path.join(outDir, "fit-report.txt"), `${text}\n`);
  console.log(`\n${text}\nReport: ${path.resolve(outDir)}`);
  return failing;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = (name) => (args.find((a) => a.startsWith(`--${name}=`)) || "").slice(name.length + 3) || null;
  const [appDir] = args.filter((a) => !a.startsWith("--"));
  if (!appDir) { console.error("Usage: node fit.js <appDir> [--out=dir] [--viewport=name,name] [--only=substring]"); process.exit(2); }
  fit(appDir, opt("out") || path.join(__dirname, "out", "fit"), opt("viewport"), opt("only"))
    .then((failing) => process.exit(failing ? 1 : 0))
    .catch((e) => { console.error(e); process.exit(2); });
}

module.exports = { fit };
