#!/usr/bin/env node
"use strict";
// Generates fixtures/populated-progress.json by loading a debug persona in the app.
// Usage: node make-fixture.js <appDir> [persona=power-user]
const fs = require("fs");
const path = require("path");
const c = require("./lib/common");

async function makeFixture(appDir, persona = "power-user") {
  const srv = await c.startServer(appDir);
  const browser = await c.launchBrowser();
  try {
    const ctx = await browser.newContext({ timezoneId: "UTC", locale: "en-US", viewport: { width: 1180, height: 820 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1[:/])/, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
    await ctx.addInitScript(c.SEEDED_RANDOM_SCRIPT);
    await ctx.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.setItem("math-muscle-trainer-debug-unlocked-v1", "true");
    });
    const page = await ctx.newPage();
    await page.clock.install({ time: c.FIXED_NOW });
    await page.clock.pauseAt(c.FIXED_NOW + 1000);
    await page.goto(`${srv.origin}/index.html?debug=1`);
    await page.click("[data-debug-open]");
    await page.click(`[data-debug-persona="${persona}"]`);
    await page.clock.runFor(500);
    const raw = await page.evaluate(() => window.localStorage.getItem(STORAGE_KEY));
    if (!raw) throw new Error("Persona did not save progress");
    const out = path.join(__dirname, "fixtures", "populated-progress.json");
    const doc = { generatedFrom: `debug persona "${persona}"`, fixedNow: new Date(c.FIXED_NOW).toISOString(), progress: JSON.parse(raw) };
    fs.writeFileSync(out, JSON.stringify(doc, null, 1));
    console.log(`Wrote ${out} (${raw.length} bytes, persona ${persona})`);
    return out;
  } finally {
    await browser.close();
    await srv.close();
  }
}

module.exports = { makeFixture };
if (require.main === module) {
  if (!process.argv[2]) { console.error("Usage: node make-fixture.js <appDir> [persona]"); process.exit(2); }
  makeFixture(process.argv[2], process.argv[3]).catch((e) => { console.error(e); process.exit(1); });
}
