"use strict";
// Deterministic app page setup and the standard screen walk, shared by capture.js and fit.js.
const fs = require("fs");
const path = require("path");
const c = require("./common");
const { VIEWPORTS } = require("./viewports");

const FIXTURE_PATH = path.join(__dirname, "..", "fixtures", "populated-progress.json");

function storageSeed(progress, colorMode) {
  const seed = {
    "math-muscle-trainer-theme-v1": "original",
    "math-muscle-trainer-color-mode-v1": colorMode,
    "math-muscle-trainer-keypad-preference-v1": "auto",
  };
  if (progress) seed["math-muscle-trainer-progress-v2"] = JSON.stringify(progress);
  return seed;
}

// [["empty", null], ["populated", progress]], generating the fixture when it is missing.
async function loadDataStates(appDir) {
  if (!fs.existsSync(FIXTURE_PATH)) {
    console.log("Fixture missing; generating from debug persona...");
    await require("../make-fixture").makeFixture(appDir);
  }
  const fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, "utf8")).progress;
  return [["empty", null], ["populated", fixture]];
}

async function settle(page, ms = 250) {
  await page.clock.runFor(ms);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready.then(() => true));
}

// New context + page with a frozen clock, seeded Math.random, no animations and seeded storage,
// loaded and settled on Home. Returns { ctx, page, errors }.
async function openApp(browser, origin, { vpName, mode, progress }) {
  const vp = VIEWPORTS[vpName];
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, hasTouch: vp.touch,
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
  return { ctx, page, errors };
}

async function answerCurrent(page, { wrong = false } = {}) {
  const answer = await page.evaluate(() => state.currentQuestion && state.currentQuestion.answer);
  if (answer === null || answer === undefined) throw new Error("No current question");
  await page.fill("#answerInput", String(wrong ? answer + 1 : answer));
  await page.press("#answerInput", "Enter");
  await page.clock.runFor(700);
}

// Visit every standard screen in order, calling shot(screenName, options) on each.
// options.tiles: false for screens captured as one viewport tile; options.dialog: true when a dialog is open.
async function walkScreens(page, shot) {
  const go = async (view) => { await page.evaluate((v) => requestView(v), view); await settle(page); };

  await shot("01-home");
  // Phone layouts split Home into swipe pages (js/app-page-swiper.js); visit each one.
  const homePages = await page.evaluate(() => {
    const swiper = document.querySelector('[data-page-swiper="home"]');
    return swiper && typeof isPageSwiperPaged === "function" && isPageSwiperPaged(swiper) ? getPageSwiperCount(swiper) : 1;
  });
  for (let i = 1; i < homePages; i += 1) {
    await page.evaluate((index) => setPageSwiperIndex(document.querySelector('[data-page-swiper="home"]'), index), i);
    await shot(`01-home-page-${i + 1}`);
  }
  if (homePages > 1) await page.evaluate(() => setPageSwiperIndex(document.querySelector('[data-page-swiper="home"]'), 0));
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
  await shot("07-options-dialog", { tiles: false, dialog: true });
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
}

module.exports = { loadDataStates, settle, openApp, walkScreens };
