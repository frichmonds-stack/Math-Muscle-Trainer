# visual-check

Screenshot-regression and click-through smoke checks for Math Muscle Trainer.
Dev-only tooling (ADR-0016): the app itself stays dependency-free. Every command takes the
app directory as an argument, so it can run against the repo root or any copy (e.g. a git
worktree of another commit).

Requirements: Node 18+ and `npm install` in this folder once (`node_modules/` and `out/` are
git-ignored). `playwright-core` is pinned to 1.56.1. Browser lookup order: `CHROME_PATH`,
Playwright's bundled Chromium, a Chromium under `PLAYWRIGHT_BROWSERS_PATH` (the cloud
container has one at `/opt/pw-browsers`; do not run `playwright install` there), then an
installed Chrome or Edge. Screenshots depend on the browser and OS, so only compare captures
made on the same machine; take a fresh baseline after switching machines.

## Commands

```bash
VC=tools/visual-check   # from the repo root
node $VC/capture.js <appDir> <outDir> [--only=substring]   # deterministic screenshots
node $VC/compare.js <dirA> <dirB> [--diff-dir=dir] [--threshold=0.1]  # exit 1 on any diff
node $VC/smoke.js   <appDir>                                # exit 1 on any failure
node $VC/make-fixture.js <appDir> [persona]                 # regenerate fixtures/populated-progress.json

$VC/run-all.sh --baseline <appDir>          # capture baseline into out/baseline
$VC/run-all.sh <appDir> out/baseline        # smoke + capture out/current + compare
$VC/run-all.sh --determinism <appDir>       # capture twice and compare (expect 0 diff)
```

Typical regression flow: capture a baseline from the known-good tree, make changes,
then capture again and compare. `compare.js` prints `DIFF name N px`, `SIZE` or `MISSING`
per file and writes red-highlighted diff PNGs (default `<dirB>/_diff`).

## What capture covers

2 data states x 3 viewports x 2 colour modes = 12 combos, ~21 screens each (252 PNGs).

- States: `empty` (new user) and `populated` (fixture from the debug persona "power-user",
  dated relative to the frozen clock).
- Viewports: `phone` 390x844, `ipad-portrait` 820x1180, `ipad-landscape` 1180x820,
  all with touch emulation (coarse pointer), so the on-screen keypad shows as on a device.
- Modes: `dark`, `light` (palette fixed to `original`).
- Screens: home, setup (empty), setup configured (addition / Target Reps / custom 5),
  Learn menu, Make 10 lesson, all 7 Progress slides, Options dialog, Practice mid-question
  (after 1 answer), all 3 Results slides.

File names: `<state>__<viewport>__<mode>__<NN-screen>-p<tile>.png`. Long pages are
captured as viewport-sized tiles (`-p1`, `-p2`, ... max 6) rather than `fullPage`, because
full-page capture changes the effective viewport (dvh units, resize handlers) and was not
reproducible. A change in page height therefore shows up as `MISSING` tiles.

## Determinism measures

- Playwright clock installed at 2026-04-15T10:00Z and paused; time only advances via
  `clock.runFor` (countdown, answer delays, HUD timers all fire identically each run).
- `Math.random` replaced by a seeded mulberry32 PRNG; timezone UTC, locale en-US.
- Animations/transitions disabled with injected CSS (capture only), caret hidden,
  pointer parked at (0,0) before each shot.
- Before every tile the root element is set to `display:none` for one forced frame, then
  restored (focus restored too). This discards all composited layers so each shot is painted
  from the current layout only. Without it, the backdrop-filter dock's subpixel paint state
  depended on which intermediate positions happened to be painted on real-time frames
  (clock paused), and its bottom edge flipped between rows 827/828 run to run.
- Google Fonts requests are stubbed with empty CSS, so text uses fallback fonts
  (offline, stable). Visual diffs therefore do not cover the web fonts.

## What smoke covers

Fresh profile at 820x1180 with touch. Dock navigation to every screen; a 5-question
Target Reps workout for each operation (answers read from `state.currentQuestion` and
cross-checked against the displayed question; one deliberate wrong answer in subtraction;
multiplication typed on the on-screen keypad; division ended early via End Workout dialog);
results counts verified; Make 10 lesson opened, advanced, exited; technique operation
selector cycled; Progress Next/Prev; Options open, colour mode toggled, every palette
selected, close; reload persistence. Fails on console errors, page errors, failed
same-origin requests, HTTP >= 400, unexpected alert/confirm. `SMOKE_VERBOSE=1` lists passes.
