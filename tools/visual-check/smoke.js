#!/usr/bin/env node
"use strict";
// Click-through smoke test. Fails on console errors, page errors, failed same-origin
// requests or HTTP >= 400 responses, and on any failed functional check.
// Usage: node smoke.js <appDir> [--headed]
const c = require("./lib/common");

const OPERATIONS = ["addition", "subtraction", "multiplication", "division"];
const SYMBOLS = { "+": (a, b) => a + b, "-": (a, b) => a - b, "−": (a, b) => a - b,
  "×": (a, b) => a * b, "x": (a, b) => a * b, "*": (a, b) => a * b,
  "÷": (a, b) => a / b, "/": (a, b) => a / b };

async function smoke(appDir) {
  const srv = await c.startServer(appDir);
  const browser = await c.launchBrowser();
  const issues = []; // { kind, detail }
  const checks = []; // { name, ok, detail }
  const external = new Set();
  const check = (name, ok, detail = "") => { checks.push({ name, ok: Boolean(ok), detail }); };

  const ctx = await browser.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, locale: "en-US" });
  // Third-party requests (Google Fonts) are stubbed so the run is offline and stable.
  await ctx.route((url) => url.origin !== srv.origin, (route) => {
    external.add(new URL(route.request().url()).host);
    route.fulfill({ status: 200, contentType: "text/css", body: "" });
  });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") issues.push({ kind: "console.error", detail: m.text() }); });
  page.on("pageerror", (e) => issues.push({ kind: "pageerror", detail: String(e && e.stack || e) }));
  page.on("requestfailed", (r) => {
    if (r.url().startsWith(srv.origin)) issues.push({ kind: "requestfailed", detail: `${r.url().slice(srv.origin.length)} ${r.failure() && r.failure().errorText}` });
  });
  page.on("response", (r) => {
    if (r.status() >= 400) issues.push({ kind: `http ${r.status()}`, detail: r.url().replace(srv.origin, "") });
  });
  page.on("dialog", (d) => { issues.push({ kind: "unexpected window dialog", detail: `${d.type()}: ${d.message()}` }); d.dismiss(); });

  const view = () => page.evaluate(() => state.view);
  const dock = async (target) => {
    await page.click(`.app-dock [data-view-target="${target}"]`);
    await page.waitForTimeout(100);
  };
  const step = async (name, fn) => {
    try { await fn(); } catch (e) { check(name, false, String(e.message || e).split("\n")[0]); }
  };

  await page.goto(`${srv.origin}/index.html`, { waitUntil: "load" });
  await page.waitForTimeout(300);
  check("loads on home", (await view()) === "home" && (await page.isVisible("#homeDashboard")));

  // Visit every top-level screen through the dock.
  await step("dock navigation", async () => {
    for (const target of ["setup", "techniques", "progress", "home"]) {
      await dock(target);
      // Home is not a .screen section; the shell gets .is-home-shell instead.
      const active = await page.evaluate(() => (document.querySelector(".page-shell.is-home-shell") ? "home" : document.querySelector(".screen.is-active")?.dataset.view));
      check(`dock -> ${target}`, (await view()) === target && active === target, `view=${await view()} active=${active}`);
    }
  });

  // One short workout per operation.
  for (const op of OPERATIONS) {
    await step(`workout ${op}`, async () => {
      await dock("setup");
      await page.click(`input[name="operation"][value="${op}"] >> xpath=..`);
      await page.click('input[name="sessionType"][value="question-goal"] >> xpath=..');
      await page.click('input[name="questionPreset"][value="custom"] >> xpath=..');
      await page.fill("#questionCustom", "5");
      await page.click("#setupStartButton");
      check(`${op}: countdown shown`, (await view()) === "countdown");
      await page.waitForFunction(() => state.view === "practice" && state.currentQuestion, null, { timeout: 8000 });
      const endEarly = op === "division";
      let answered = 0; let mismatches = 0; let wrongGiven = 0;
      const limit = endEarly ? 3 : 10;
      while ((await view()) === "practice" && answered < limit) {
        const { text, answer } = await page.evaluate(() => {
          window.__smokePrevQ = state.currentQuestion;
          return { text: elements.problemText.textContent.trim(), answer: state.currentQuestion.answer };
        });
        const m = text.match(/^(-?\d+)\s*(\S)\s*(-?\d+)$/);
        const computed = m && SYMBOLS[m[2]] ? SYMBOLS[m[2]](Number(m[1]), Number(m[3])) : NaN;
        if (computed !== answer) { mismatches += 1; issues.push({ kind: "answer mismatch", detail: `${op}: "${text}" displayed, state answer ${answer}, computed ${computed}` }); }
        const giveWrong = op === "subtraction" && answered === 1;
        const value = String(giveWrong ? answer + 1 : answer);
        if (giveWrong) wrongGiven += 1;
        const keypadVisible = await page.isVisible("#practiceKeypad");
        if (op === "multiplication" && keypadVisible) {
          for (const ch of value) await page.click(`#practiceKeypad [data-keypad-key="${ch === "-" ? "sign" : ch}"]`);
          await page.click("#checkButton");
        } else {
          await page.fill("#answerInput", value);
          await page.press("#answerInput", "Enter");
        }
        answered += 1;
        if (giveWrong) {
          const fb = await page.textContent("#feedback");
          check(`${op}: wrong-answer feedback`, /Correct answer/.test(fb || ""), fb);
        }
        await page.waitForFunction(() => state.view !== "practice" || (state.currentQuestion && state.currentQuestion !== window.__smokePrevQ), null, { timeout: 5000 });
      }
      if (endEarly) {
        await page.click("#finishSessionButton");
        check(`${op}: end-workout dialog opens`, await page.evaluate(() => elements.endWorkoutDialog.open));
        await page.click("#confirmEndWorkoutButton");
        await page.waitForTimeout(100);
      }
      check(`${op}: reached results`, (await view()) === "results", `view=${await view()}`);
      const shown = Number(await page.textContent("#resultQuestions"));
      const correct = Number(await page.textContent("#resultCorrect"));
      check(`${op}: results count (${answered} answered)`, shown === answered && correct === answered - wrongGiven, `answered=${shown} correct=${correct}`);
      check(`${op}: displayed question matched answer key`, mismatches === 0);
    });
  }
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
  check("4 workouts saved to localStorage", (saved.workoutHistory || []).length === 4, `history=${(saved.workoutHistory || []).length}`);

  // Learn: open a lesson, advance a step, exit, cycle technique operations.
  await step("learn", async () => {
    await dock("techniques");
    await page.click('[data-addition-technique="make-10"]');
    check("learn: lesson opens", await page.evaluate(() => state.technique.mode === "addition-lesson"));
    const before = await page.evaluate(() => JSON.stringify(state.technique.additionLesson));
    await page.click('[data-technique-action="addition-next"]');
    const after = await page.evaluate(() => JSON.stringify(state.technique.additionLesson));
    check("learn: lesson advances a step", before !== after);
    await page.click("#techniqueExitNavButton");
    check("learn: exit dialog opens", await page.evaluate(() => elements.exitTechniqueDialog.open));
    await page.click("#confirmExitTechniqueButton");
    check("learn: back to menu", await page.evaluate(() => state.technique.mode === "menu"));
    const labels = [];
    for (let i = 0; i < 4; i += 1) {
      await page.click('[data-technique-operation-shift="1"]');
      labels.push(await page.evaluate(() => state.technique.selectedOperation));
    }
    check("learn: operation selector cycles", new Set(labels).size === 4, labels.join(","));
  });

  // Progress carousel.
  await step("progress", async () => {
    await dock("progress");
    const total = await page.evaluate(() => PROGRESS_SLIDES.length);
    const kickers = [];
    const start = await page.evaluate(() => state.progressSlideIndex);
    for (let i = 0; i < total; i += 1) {
      await page.click("#progressNextButton");
      kickers.push(await page.textContent("#progressCarouselKickerLabel"));
      if (i === 0) {
        const now = await page.evaluate(() => state.progressSlideIndex);
        check("progress: Next advances exactly one slide", now === (start + 1) % total, `index ${start} -> ${now}`);
      }
    }
    const idx = await page.evaluate(() => state.progressSlideIndex);
    check(`progress: ${total} Next clicks visit all slides and wrap`, idx === start && new Set(kickers).size === total, kickers.join(" | "));
    await page.evaluate(() => { state.progressSlideIndex = 0; renderProgressCarousel(); });
    await page.click("#progressPrevButton");
    const prevIdx = await page.evaluate(() => state.progressSlideIndex);
    check("progress: Prev from first goes to last slide", prevIdx === total - 1, `index 0 -> ${prevIdx}`);
  });

  // Options dialog, palettes and colour mode.
  await step("options", async () => {
    await page.click("#optionsButton");
    check("options: dialog opens", await page.evaluate(() => elements.optionsDialog.open));
    for (const mode of ["light", "dark", "light"]) {
      await page.selectOption("#colorModeSelect", mode);
      check(`options: colour mode -> ${mode}`, await page.evaluate((m) => document.body.dataset.colorMode === m && localStorage.getItem(COLOR_MODE_STORAGE_KEY) === m, mode));
    }
    const themes = await page.evaluate(() => THEME_OPTIONS.map((t) => t.key));
    for (const theme of [...themes.slice(1), themes[0]]) {
      await page.selectOption("#themeSelect", theme);
      check(`options: palette -> ${theme}`, await page.evaluate((t) => document.body.dataset.theme === t, theme));
    }
    await page.click("#optionsCloseButton");
    check("options: dialog closes", await page.evaluate(() => !elements.optionsDialog.open));
  });

  // Persistence across reload.
  await step("reload", async () => {
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(300);
    check("reload: colour mode persisted", await page.evaluate(() => document.body.dataset.colorMode === "light"));
    check("reload: workouts persisted", await page.evaluate(() => state.progress.workoutHistory.length === 4));
  });

  await browser.close();
  await srv.close();

  const failedChecks = checks.filter((x) => !x.ok);
  console.log(`Smoke: ${checks.length - failedChecks.length}/${checks.length} checks passed`);
  failedChecks.forEach((x) => console.log(`  FAIL  ${x.name}${x.detail ? `  (${x.detail})` : ""}`));
  if (process.env.SMOKE_VERBOSE) checks.filter((x) => x.ok).forEach((x) => console.log(`  ok    ${x.name}${x.detail ? `  (${x.detail})` : ""}`));
  console.log(`Runtime issues: ${issues.length}`);
  issues.forEach((x) => console.log(`  ${x.kind}: ${x.detail}`));
  if (external.size) console.log(`Note: stubbed third-party requests to ${[...external].join(", ")}`);
  const pass = failedChecks.length === 0 && issues.length === 0;
  console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
  return pass;
}

if (require.main === module) {
  const appDir = process.argv[2];
  if (!appDir) { console.error("Usage: node smoke.js <appDir>"); process.exit(2); }
  smoke(appDir).then((ok) => process.exit(ok ? 0 : 1)).catch((e) => { console.error(e); process.exit(1); });
}
