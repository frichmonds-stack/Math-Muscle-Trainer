#!/usr/bin/env node
"use strict";
// Deterministic screenshot capture.
// Usage: node capture.js <appDir> <outDir> [--only=substring]
const fs = require("fs");
const path = require("path");
const c = require("./lib/common");

const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  "ipad-portrait": { width: 820, height: 1180 },
  "ipad-landscape": { width: 1180, height: 820 },
};
const MODES = ["dark", "light"];
const MAX_TILES = 6;
const FIXTURE_PATH = path.join(__dirname, "fixtures", "populated-progress.json");

function storageSeed(progress, colorMode) {
  const seed = {
    "math-muscle-trainer-theme-v1": "original",
    "math-muscle-trainer-color-mode-v1": colorMode,
    "math-muscle-trainer-keypad-preference-v1": "auto",
  };
  if (progress) seed["math-muscle-trainer-progress-v2"] = JSON.stringify(progress);
  return seed;
}

async function settle(page, ms = 250) {
  await page.clock.runFor(ms);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready.then(() => true));
}

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

async function answerCurrent(page, { wrong = false } = {}) {
  const answer = await page.evaluate(() => state.currentQuestion && state.currentQuestion.answer);
  if (answer === null || answer === undefined) throw new Error("No current question");
  await page.fill("#answerInput", String(wrong ? answer + 1 : answer));
  await page.press("#answerInput", "Enter");
  await page.clock.runFor(700);
}

async function captureCombo(browser, origin, outDir, stateName, progress, vpName, mode, only) {
  const vp = VIEWPORTS[vpName];
  const ctx = await browser.newContext({
    viewport: vp, deviceScaleFactor: 1, hasTouch: true,
    timezoneId: "UTC", locale: "en-US", reducedMotion: "reduce", colorScheme: mode,
  });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1[:/])/, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" }));
  await ctx.addInitScript(c.SEEDED_RANDOM_SCRIPT);
  await ctx.addInitScript(({ seed, css }) => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    Object.entries(seed).forEach(([k, v]) => window.localStorage.setItem(k, v));
    const style = document.createElement("style");
    style.setAttribute("data-visual-check", "");
    style.textContent = css;
    document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
  }, { seed: storageSeed(progress, mode), css: c.NO_MOTION_CSS });

  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.clock.install({ time: c.FIXED_NOW });
  await page.clock.pauseAt(c.FIXED_NOW + 1000);
  await page.goto(`${origin}/index.html`, { waitUntil: "load" });
  await settle(page, 1000);

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
  const go = async (view) => { await page.evaluate((v) => requestView(v), view); await settle(page); };

  await shot("01-home");
  await go("setup");
  await shot("02-setup");

  await go("techniques");
  await shot("04-learn-menu");
  await page.click('[data-addition-technique="make-10"]');
  await shot("05-learn-lesson-make-10");
  await page.evaluate(() => { resetTechniqueState(state.technique.selectedTable, "menu"); renderTechniqueScreen(); });

  await go("progress");
  const slides = await page.evaluate(() => PROGRESS_SLIDES.slice());
  for (let i = 0; i < slides.length; i += 1) {
    await page.evaluate((index) => { state.progressSlideIndex = index; renderProgressCarousel(); }, i);
    await shot(`06-progress-${i + 1}-${slides[i]}`);
  }

  await page.evaluate(() => openOptionsDialog());
  await shot("07-options-dialog", { tiles: false });
  await page.click("#optionsCloseButton");

  // Configure a 5-question addition workout through the real setup UI.
  await go("setup");
  await page.click('input[name="operation"][value="addition"] >> xpath=..');
  await page.click('input[name="additionDifficulty"][value="easy"] >> xpath=..');
  await page.click('input[name="sessionType"][value="question-goal"] >> xpath=..');
  await page.click('input[name="questionPreset"][value="custom"] >> xpath=..');
  await page.fill("#questionCustom", "5");
  await shot("03-setup-configured");
  await page.click("#setupStartButton");
  await page.clock.runFor(4500); // countdown
  if ((await page.evaluate(() => state.view)) !== "practice") throw new Error("Workout did not reach practice view");
  await answerCurrent(page);
  await page.clock.runFor(1000);
  await shot("08-practice-mid-question");
  await answerCurrent(page, { wrong: true });
  for (let i = 0; i < 5 && (await page.evaluate(() => state.active)); i += 1) await answerCurrent(page);
  if ((await page.evaluate(() => state.view)) !== "results") throw new Error("Workout did not reach results view");
  const resultSlides = await page.evaluate(() => RESULTS_SLIDES.slice());
  for (let i = 0; i < resultSlides.length; i += 1) {
    await page.evaluate((index) => { state.resultsSlideIndex = index; renderResultsCarousel(); }, i);
    await shot(`09-results-${i + 1}-${resultSlides[i]}`);
  }

  await ctx.close();
  if (errors.length) console.warn(`  page errors in ${stateName}/${vpName}/${mode}:\n    ${errors.join("\n    ")}`);
  return count;
}

async function capture(appDir, outDir, only) {
  if (!fs.existsSync(FIXTURE_PATH)) {
    console.log("Fixture missing; generating from debug persona...");
    await require("./make-fixture").makeFixture(appDir);
  }
  const fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, "utf8")).progress;
  fs.mkdirSync(outDir, { recursive: true });
  const srv = await c.startServer(appDir);
  const browser = await c.launchBrowser();
  let total = 0;
  try {
    for (const [stateName, progress] of [["empty", null], ["populated", fixture]]) {
      for (const vpName of Object.keys(VIEWPORTS)) {
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
  const [appDir, outDir] = args.filter((a) => !a.startsWith("--"));
  if (!appDir || !outDir) { console.error("Usage: node capture.js <appDir> <outDir> [--only=substring]"); process.exit(2); }
  capture(appDir, outDir, only).catch((e) => { console.error(e); process.exit(1); });
}
