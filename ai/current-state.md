# Current State

Last updated: 2026-07-11

## Version And Publication

- Local root app version is `v0.20.7`.
- The current rolling live build is `docs/live`, and `docs/index.html` marks it as `v0.20.7 visual design brief`.
- The latest preserved numbered snapshot is `docs/v17` for `v0.20.0`.
- The latest recorded pushed release commit is `b6429d0` (`Release v0.20.7 visual design brief`).

## Architecture

- The app is a static `index.html` + `styles.css` + `js/app-*.js` browser app with no bundler or package manager.
- Source-of-truth runtime files live at the repo root; `docs/live` is the rolling published copy and `docs/v*` holds preserved archives.
- Browser-local storage uses `math-muscle-trainer-*` keys with legacy fallback reads for older saved progress and preferences.
- Product-specific UI remains internal; design/system docs now define a future hybrid component architecture without selecting or installing an external library.

## Implemented Capabilities

- Home is the startup surface and acts as the learner's daily training dashboard.
- Workout setup and practice support addition, subtraction, multiplication, and division.
- Learn includes multiplication `x1` through `x12`, addition lesson flows, and subtraction/division placeholders.
- Progress includes workout records, streaks, fact tracking, operation mastery, and related evidence views.
- Debug mode is opt-in via Home arm-mark double-click or `?debug=1` / `#debug`, then the classroom password `N0v4r3`.

## Active Workstream

- Current documentation workstream: AI workflow consolidation, product-memory split, design-doc authority cleanup, and hybrid UI component architecture documentation.
- Highest product implementation priorities remain lesson-system direction, lesson content expansion, zero states, and clearer progress/evidence communication.

## Known Risks Or Defects

- Learn, Progress, and Options still need fuller dedicated visual reference coverage.
- Several long-term product decisions remain open around lesson progression, onboarding, mastery communication, negative-number handling, and future account/subscription/privacy work.
- Touch/iPad QA remains important for Practice keypad fit, portrait behavior, and light-mode contrast.

## Latest Verified Checks

- 2026-05-19 publish close ran `node --check` on all root JS modules, `git diff --check`, `scripts/publish-live.ps1 -Label "v0.20.7 visual design brief"`, and `scripts/check-repo.ps1`.
- Result: `All repo checks passed.`
- GitHub Pages was last verified on 2026-05-19 for `/`, `/live/js/app-core.js`, `/design/visual-design-system.md`, and `/design/reference/screenshots/setup-light-v0.20.5.png`.

## Immediate Handoff

- Read `AGENTS.md`, `ai/context.md`, `ai/current-state.md`, and `ai/active-task.md` first.
- Use `ai/task-map.md` only to choose the right route doc, then read the matching `ai/routes/*.md`.
- Inspect `git status --short` before editing because local documentation work may be in progress.
