# Current State

Last updated: 2026-09-25

## Version And Publication

- Local root app version is `v0.20.7`.
- The current rolling live build is `docs/live`, and `docs/index.html` marks it as `v0.20.7 Cloudflare deployment configuration and visual reference refresh`.
- The latest preserved numbered snapshot is `docs/v17` for `v0.20.0`.
- `wrangler.jsonc` provides an optional assets-only Cloudflare Workers deployment of `docs/live/` as `math-muscle-trainer`; no Worker script or package infrastructure is present.

## Architecture

- The app is a static `index.html` + `styles.css` + `js/app-*.js` browser app with no bundler or package manager.
- Source-of-truth runtime files live at the repo root; `docs/live` is the rolling publishable copy and `docs/v*` holds preserved archives.
- Browser-local storage uses `math-muscle-trainer-*` keys with legacy fallback reads for older saved progress and preferences.
- Product-specific UI remains internal; design/system docs now define a future hybrid component architecture without selecting or installing an external library.
- GitHub Pages is intentionally shut down. `docs/live` remains the rolling build copied by the publish script; Cloudflare Workers is configured as an additional manual deployment target but has not been deployed.

## Implemented Capabilities

- Home is the startup surface and acts as the learner's daily training dashboard.
- Workout setup and practice support addition, subtraction, multiplication, and division.
- Learn includes multiplication `x1` through `x12`, addition lesson flows, and subtraction/division placeholders.
- Progress includes workout records, streaks, fact tracking, operation mastery, and related evidence views.
- Debug mode is opt-in via Home arm-mark double-click or `?debug=1` / `#debug`, then the classroom password `N0v4r3`.

## Active Workstream

- The Cloudflare Workers static-assets deployment configuration is complete locally and has not been deployed.
- AI workflow documentation uses routed context and command procedures. `Normal Close` is retired; `execute now` owns local implementation and matching docs, and `Publish Close` owns release checks, Git delivery, and the approved AI Project Manager/Notion closeout. Notion delivery requires the opt-in configuration in committed HEAD.
- Highest product implementation priorities remain lesson-system direction, lesson content expansion, zero states, and clearer progress/evidence communication.

## Known Risks Or Defects

- Learn, Progress, and Options still need fuller dedicated visual reference coverage.
- Several long-term product decisions remain open around lesson progression, onboarding, mastery communication, negative-number handling, and future account/subscription/privacy work.
- Touch/iPad QA remains important for Practice keypad fit, portrait behavior, and light-mode contrast.

## Latest Verified Checks

- The AI workflow documentation update passed `scripts/check-repo.ps1` and `git diff --check` locally on 2026-09-25.
- The last app publish ran `scripts/check-repo.ps1` and `git diff --check` successfully on 2026-09-23.
- Cloudflare configuration passed a non-deploying Wrangler dry run on 2026-09-23. No Cloudflare deployment or current live-site verification has been recorded.

## Immediate Handoff

- Read `AGENTS.md`, inspect `git status --short`, and use `ai/INDEX.md` to select the relevant route. Read only the state or spec implicated by the task.
