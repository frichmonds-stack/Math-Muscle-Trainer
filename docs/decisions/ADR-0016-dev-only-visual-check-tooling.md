# ADR-0016: Dev-Only Visual Check Tooling

Date: 2026-10-18
Status: Accepted

## Context

The app has no automated tests. The CSS cleanup and split (ADR-0015) were verified with a headless-browser screenshot comparison and a click-through smoke run that were first built in a temporary cloud scratchpad. The click-through also found real bugs. The owner chose to keep these tools in the repository for later refactors.

## Decision

- Keep the tooling in `tools/visual-check/`: deterministic screenshot capture, pixel comparison, a click-through smoke run, a populated-progress fixture, a screen-fit checker, and an HTML review sheet.
- Screen sizes live in one list (`tools/visual-check/lib/viewports.js`): small phone, phone, phone landscape, iPad portrait, iPad landscape, laptop and desktop. The debug-mode screen-size switcher (ADR-0009) offers the same list, and `tests/viewports.test.js` keeps the two in step.
- The fit checker fails a screen when the page or a panel scrolls, content is off-screen or cut off, a touch target is under 24px (WCAG 2.2 AA minimum), or text is under 10px. Touch targets under 44px and text under 12px are warnings, not failures.
- It is dev-only Node tooling with pinned npm dependencies (`playwright-core`, `pngjs`, `pixelmatch`). The app itself stays static and dependency-free; nothing under `tools/` is loaded by the app or copied to `docs/live`.
- `node_modules/` and captured screenshots (`out/`) are git-ignored. Baselines are captured on the machine that compares them, because rendering differs between browsers and operating systems.

## Consequences

- Refactors that should not change the UI are verified with a 0-difference screenshot comparison plus a passing smoke run, before and after.
- Running the tools needs Node and a Chromium-family browser (bundled, `CHROME_PATH`, or an installed Chrome or Edge).
- The smoke run's checks need updating when screens or flows change on purpose.
- Layout work is judged against the fit report (`run-all.sh --review`) as well as screenshots; added 2026-10-27 for the responsive layout work (`TASK-UI-002`).
