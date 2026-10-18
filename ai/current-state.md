# Current State

Last updated: 2026-10-18

## Version And Publication

- Local root app version is `v0.20.9`.
- The current rolling live build is `docs/live`, and `docs/index.html` marks it as `v0.20.9 unit tests, dev tools and JS split`.
- The latest preserved numbered snapshot is `docs/v17` for `v0.20.0`.
- `wrangler.jsonc` provides an optional assets-only Cloudflare Workers deployment of `docs/live/` as `math-muscle-trainer`; no Worker script or package infrastructure is present.

## Architecture

- The app is a static `index.html` + `css/*.css` + `js/app-*.js` browser app with no bundler or package manager. Progress and Learn code is split by area into `js/app-progress-*.js` and `js/app-techniques-*.js`; `index.html` script order is load order.
- Source-of-truth runtime files live at the repo root; `docs/live` is the rolling publishable copy and `docs/v*` holds preserved archives.
- Browser-local storage uses `math-muscle-trainer-*` keys with legacy fallback reads for older saved progress and preferences.
- Product-specific UI remains internal; design/system docs now define a future hybrid component architecture without selecting or installing an external library.
- GitHub Pages is disabled (no Pages site since 2026-10-16). `docs/live` remains the rolling build copied by the publish script. Cloudflare Workers Builds uploads an inactive version on each push to `main` (deploy command `npx wrangler versions upload`); the owner deploys a chosen version from the Cloudflare dashboard (ADR-0013).

- Dev-only screenshot and click-through tooling lives in `tools/visual-check/` (ADR-0016); the app stays dependency-free.
- `tests/` holds 211 Node characterisation tests that load the real `js/` files into a sandbox with a fake DOM (`node --test tests/`).

## Implemented Capabilities

- Home is the startup surface and acts as the learner's daily training dashboard.
- Workout setup and practice support addition, subtraction, multiplication, and division.
- Learn includes multiplication `x1` through `x12`, addition lesson flows, and subtraction/division placeholders.
- Progress includes workout records, streaks, fact tracking, operation mastery, and related evidence views.
- Debug mode is opt-in via Home arm-mark double-click or `?debug=1` / `#debug`, then the classroom password `N0v4r3`.

## Active Workstream

- Cloud interim overlay (temporary): cloud Claude sessions load `ai/cloud-interim.md` through the `SessionStart` hook in `.claude/settings.json`; `scripts/check-repo.mjs` is the Node port of `check-repo.ps1`. Remove per the overlay's removal steps when cloud work ends.
- Cloudflare is the only live channel. `v0.20.8` (PR #2, merge `4a58e56`) went live on 2026-10-18; the owner reports the merge to `main` promoted it automatically, which contradicts ADR-0013 and `AGENTS.md`. Until that is resolved, treat any merge to `main` as a deployment that needs `deploy now`.
- AI workflow documentation uses routed context and command procedures. `Normal Close` is retired; `execute now` owns local implementation and matching docs, and `Publish Close` owns release checks, Git delivery, and the approved AI Project Manager/Notion closeout. Notion delivery requires the opt-in configuration in committed HEAD.
- Highest product implementation priorities remain lesson-system direction, lesson content expansion, zero states, and clearer progress/evidence communication.

## Known Risks Or Defects

- The publish and check PowerShell scripts were rewritten in the cloud to discover `css/*.css` and `js/*.js` by pattern but have not been run; run `scripts/check-repo.ps1` and `scripts/publish-live.ps1` once locally.
- Learn, Progress, and Options still need fuller dedicated visual reference coverage.
- Several long-term product decisions remain open around lesson progression, onboarding, mastery communication, negative-number handling, and future account/subscription/privacy work.
- Touch/iPad QA remains important for Practice keypad fit, portrait behavior, and light-mode contrast.

## Latest Verified Checks

- 2026-10-18 (cloud): JS split of progress and techniques code: 211/211 unit tests, smoke 45/45 on root and `docs/live`, 252/252 identical screenshots, top-level declarations unchanged apart from two removed never-called helpers.
- 2026-10-18 (cloud): CSS cleanup (8,152 to 7,082 lines) and 14-file split gave 252/252 pixel-identical screenshots; `node scripts/check-repo.mjs` passes.
- 2026-10-18 (cloud): headless Chromium smoke run passes 45/45 checks with no console errors after fixing the Progress arrow double-binding, the invalid answer pattern, and phone-width overflow.
- 2026-10-18 (cloud): `node scripts/check-repo.mjs` passed on the current repo and failed as expected on a deliberately broken copy (duplicate id, missing script, undefined call, live drift).
- The AI workflow documentation update passed `scripts/check-repo.ps1` and `git diff --check` locally on 2026-09-25.
- The last app publish ran `scripts/check-repo.ps1` and `git diff --check` successfully on 2026-09-23.
- 2026-10-16: the Cloudflare workers.dev site served `APP_VERSION = "v0.20.7"`; GitHub reported no Pages site and the github.io address returned 404.

## Immediate Handoff

- Read `AGENTS.md`, inspect `git status --short`, and use `ai/INDEX.md` to select the relevant route. Read only the state or spec implicated by the task.
