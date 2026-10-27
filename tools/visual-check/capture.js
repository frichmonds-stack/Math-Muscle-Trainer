#!/usr/bin/env node
"use strict";
// Deterministic screenshot capture.
// Usage: node capture.js <appDir> <outDir> [--only=substring] [--viewport=name,name]
const fs = require("fs");
const path = require("path");
const { openApp, settle, walkScreens, loadDataStates } = require("./lib/app-session");
const { selectViewports } = require("./lib/viewports");
const c = require("./lib/common");

const MODES = ["dark", "light"];
const MAX_TILES = 6;

// Rebuild the page's paint/compositor state from scratch before a screenshot.
// Root cause of the populated/phone/dark flake: the dock (.app-dock: backdrop-filter, so
// directly composited, plus translateX(-50%)) moves between fractional positions as page
// height changes (e.g. top 1412.234px on home, 774.5625px on setup). Chromium keeps the
// subpixel raster/paint state it established for that composited layer at whichever
// intermediate positions happened to be painted, and frames are produced on real time
// while the page clock is paused, so which positions got painted varied run to run. The
// dock's bottom edge then landed on row 827 or 828. Taking the root out of the layout for one
// frame discards all composited layers, so every shot is painted from the current layout only.
async function resetCompositing(page) {
  await page.evaluate(() => {
    window.__vcFocus = document.activeElement;
    document.documentElement.style.setProperty("display", "none", "important");
  });
  await page.screenshot(); // forces a frame without any layers
  const focusRestored = await page.evaluate(() => {
    document.documentElement.style.removeProperty("display");
    if (!document.documentElement.getAttribute("style")) document.documentElement.removeAttribute("style");
    const el = window.__vcFocus;
    delete window.__vcFocus;
    if (el && el !== document.body && document.activeElement !== el) el.focus({ preventScroll: true });
    return !el || document.activeElement === el;
  });
  if (!focusRestored) throw new Error("Focus could not be restored after compositing reset");
}

async function captureCombo(browser, origin, outDir, stateName, progress, vpName, mode, only) {
  const { ctx, page, errors } = await openApp(browser, origin, { vpName, mode, progress });

  let count = 0;
  // Viewport-sized tiles instead of fullPage: fullPage capture temporarily changes the
  // effective viewport (dvh units, resize handlers), which made results nondeterministic.
  const shot = async (screen, { tiles = true } = {}) => {
    const base = `${stateName}__${vpName}__${mode}__${screen}`;
    if (only && !base.includes(only)) return;
    await settle(page);
    const { scrollHeight, innerHeight } = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight, innerHeight: window.innerHeight,
    }));
    const tileCount = tiles ? Math.min(MAX_TILES, Math.max(1, Math.ceil((scrollHeight - 1) / innerHeight))) : 1;
    for (let t = 0; t < tileCount; t += 1) {
      await resetCompositing(page);
      await page.evaluate((y) => window.scrollTo(0, y), t * innerHeight);
      await page.clock.runFor(50);
      // Park the pointer so hover styles never depend on where the last click landed.
      await page.mouse.move(0, 0);
      await page.waitForTimeout(30);
      await page.screenshot({ path: path.join(outDir, `${base}-p${t + 1}.png`), animations: "disabled", caret: "hide" });
      count += 1;
    }
    await page.evaluate(() => window.scrollTo(0, 0));
  };
  await walkScreens(page, shot);

  await ctx.close();
  if (errors.length) console.warn(`  page errors in ${stateName}/${vpName}/${mode}:\n    ${errors.join("\n    ")}`);
  return count;
}

async function capture(appDir, outDir, only, viewportList) {
  const viewports = selectViewports(viewportList);
  const dataStates = await loadDataStates(appDir);
  fs.mkdirSync(outDir, { recursive: true });
  const srv = await c.startServer(appDir);
  const browser = await c.launchBrowser();
  let total = 0;
  try {
    for (const [stateName, progress] of dataStates) {
      for (const vpName of viewports) {
        for (const mode of MODES) {
          const n = await captureCombo(browser, srv.origin, outDir, stateName, progress, vpName, mode, only);
          console.log(`captured ${String(n).padStart(2)}  ${stateName} / ${vpName} / ${mode}`);
          total += n;
        }
      }
    }
  } finally {
    await browser.close();
    await srv.close();
  }
  console.log(`Done: ${total} screenshots in ${path.resolve(outDir)}`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const only = (args.find((a) => a.startsWith("--only=")) || "").slice(7) || null;
  const viewportList = (args.find((a) => a.startsWith("--viewport=")) || "").slice(11) || null;
  const [appDir, outDir] = args.filter((a) => !a.startsWith("--"));
  if (!appDir || !outDir) { console.error("Usage: node capture.js <appDir> <outDir> [--only=substring] [--viewport=name,name]"); process.exit(2); }
  capture(appDir, outDir, only, viewportList).catch((e) => { console.error(e); process.exit(1); });
}
