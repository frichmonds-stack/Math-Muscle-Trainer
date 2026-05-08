# Session Log

## 2026-05-07 - AI Continuity Setup

- Added repo-native AI continuity structure under `ai/`.
- Added root `AGENTS.md` so future Codex sessions have project guidance.
- Added start and close prompts for future AI sessions.
- Added ADR-0001 to document the decision to keep continuity files in the repo.
- Captured current app state, open threads, and safest next actions.
- No app runtime behavior was intentionally changed by this setup.

## 2026-05-07 - Continuity Ownership Clarified

- Clarified that `AGENTS.md`, `ai/`, and `docs/decisions/` are Codex-managed continuity files.
- Recorded that the user should not need to maintain those files manually.
- Kept `README.md`, `CHANGELOG.md`, and `PROJECT_NOTES.md` as regular project documentation with distinct roles.

## 2026-05-07 - Project Rename Standardized

- Standardized product/site naming as `Math Muscle Trainer` across app metadata, docs pages, scripts, and snapshots.
- Updated descriptions to frame the app as a general arithmetic trainer covering addition, subtraction, multiplication, and division.
- Renamed browser storage namespaces to `math-muscle-trainer-*` with fallback reads for legacy saved progress and preferences.
- Bumped the root app to `v0.12.0` and prepared `docs/v9` as the latest snapshot.

## 2026-05-07 - AI Task Map Added

- Added `ai/task-map.md` to route future AI sessions by work type.
- Updated `AGENTS.md` and `ai/prompts/session-start.md` so session startup includes the task map.
- Recorded task-map ownership inside the AI continuity system.

## 2026-05-07 - Session Close Protocol Expanded

- Expanded `AGENTS.md` and `ai/prompts/session-close.md` so session close includes affected documentation updates.
- Added explicit release/publish close steps for snapshot publishing, Git status/remote checks, requested pushes, and live GitHub Pages verification.
- Added a rule that future sessions must not claim GitHub or the live site are updated unless actually pushed and verified.

## 2026-05-07 - Publish Close Prepared

- Ran the publish-close protocol for the rename/versioning/docs/AI-continuity batch.
- Confirmed `scripts/check-repo.ps1` passes and the Git remote points at `Math-Muscle-Trainer.git`.
- Kept `docs/v9` as the latest published app snapshot because no newer root app snapshot was needed for AI-documentation-only changes.
- Recorded that GitHub Pages deployment and live-site verification must be reported after push.

## 2026-05-07 - Publish Close Verified

- Committed and pushed the prepared batch to `origin/main`.
- Verified the pushed `main` branch matches the local commit before live-site checks.
- Verified the GitHub Pages version index and `docs/v9` app are live at the `Math-Muscle-Trainer` Pages URL.

## 2026-05-08 - Addition Lessons Linked

- Added a reusable addition lesson runner based on atomic `Idea -> Practice` components and final mixed practice.
- Linked all current addition lesson cards into real lessons: Make 10, adding by 1s/10s/100s/1000s, Counting On Easy/Medium, and Bridging Easy/Medium/Advanced/Expert.
- Added addition lesson completion tracking with `addition:<lesson-id>` technique progress keys and focused workout handoffs.
- Recorded ADR-0003 for the reusable addition lesson loop.
- Restored Progress carousel previous/next controls in the top red kicker row after the label/header alignment.
- Added table-specific multiplication lessons for `x1` through `x12` using the existing five-section lesson flow.
- Unlocked multiplication and addition lesson stage pills so content can be inspected without completing earlier sections.
- Recorded ADR-0004 for unlocked lesson sections.

## 2026-05-08 - Lesson Content Workflow Initialized

- Added `AGENTS.md` rules for teacher-authored lesson content.
- Created the `learn/` workflow structure for specs, structured lesson data, scaffolds, mental models, and review notes.
- Added an empty Make 10 teacher spec and placeholder structured lesson data without changing app behavior.
- Recorded ADR-0005 for the lesson content workflow.

## 2026-05-08 - v0.13.0 Publish Close Prepared

- Prepared the `v0.13.0` lesson expansion batch for publish close.
- Confirmed `docs/v10` is marked latest in `docs/index.html`.
- Confirmed the Git remote points at `https://github.com/frichmonds-stack/Math-Muscle-Trainer.git`.
- Ran `scripts/check-repo.ps1`; all repo checks passed.
- Committed and pushed the batch to `origin/main`.
- Verified the pushed `main` branch matches local commit `50197ed79f3e25e1fab5c289cc6cfd9448240f3d`.
- Verified the GitHub Pages version index, `docs/v10` app, and live `v10/js/app-core.js` are reachable; app core serves `APP_VERSION = "v0.13.0"`.
