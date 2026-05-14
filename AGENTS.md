# AGENTS.md

Project guidance for Codex and other AI coding sessions in this repo.

## Repo Overview

- App: `Math Muscle Trainer`, a strength-themed arithmetic practice webapp.
- Stack: plain `HTML`, `CSS`, and browser JavaScript. There is no bundler or package manager.
- Main app files:
  - `index.html` - app markup and screen structure.
  - `styles.css` - visual design and responsive layout.
  - `js/app-core.js` - constants, state, storage normalization, setup helpers.
  - `js/app-practice.js` - question pools, workout flow, answer handling.
  - `js/app-progress.js` - progress analytics, trackers, records, carousel behavior.
  - `js/app-techniques.js` - Learn / Techniques lessons.
  - `js/app-init.js` - startup rendering and event binding.
- The rolling live GitHub Pages build lives under `docs/live`; preserved static snapshots live under `docs/v*`; `docs/index.html` marks the current live build and lists preserved snapshots.
- Project memory lives in `PROJECT_NOTES.md` and the `ai/` continuity files.
- Current product name is `Math Muscle Trainer`; avoid reintroducing prior product branding except when discussing external/manual rename history.

## Session Start Protocol

1. Read this file first.
2. Read, in order:
   - `ai/context.md`
   - `ai/current-state.md`
   - `ai/task-map.md`
   - `ai/open-threads.md`
   - `ai/tasks/next-actions.md`
   - recent entries in `ai/session-log.md`
3. Inspect `git status --short` before editing.
4. Summarize the current repo state and the intended change before changing code.
5. For work affecting product direction, architecture, release flow, storage shape, or long-lived conventions, create or update an ADR in `docs/decisions/`.

## Session Close Protocol

Before finishing a coding session:

1. Run the best available checks for the change.
2. Update all documentation affected by the work:
   - `README.md` for user-facing features, run/check/publish steps, or repo structure.
   - `CHANGELOG.md` and `APP_VERSION` for user-visible behavior or releases.
   - `PROJECT_NOTES.md` for broader project memory, testing feedback, or backlog shifts.
   - `docs/index.html` and `docs/live` via `scripts/publish-live.ps1` for routine live updates.
   - `docs/index.html` and `docs/v*` via `scripts/publish-snapshot.ps1` only for preserved numbered snapshots.
3. Update AI continuity:
   - `ai/current-state.md` with the new implementation state.
   - `ai/session-log.md` with a dated entry.
   - `ai/tasks/next-actions.md` with the safest next tasks.
   - `ai/open-threads.md` if questions were answered or new ones appeared.
4. If a lasting decision was made, add or update an ADR under `docs/decisions/`.
5. For release/publish work, or when the user asks for changes to be live:
   - Run `scripts/check-repo.ps1` after publishing `docs/live` or a numbered snapshot.
   - Check `git status --short` and `git remote -v`.
   - Commit and push only when the user requested or approved publishing.
   - Verify the GitHub Pages/live URL when network access and deployment timing allow.
6. In the final response, explicitly state:
   - files changed,
   - docs updated,
   - checks run,
   - GitHub push status,
   - live internet verification status,
   - assumptions and manual review still needed.
7. Do not claim GitHub is updated or the site is live unless it was actually pushed and verified. If not done, say exactly what remains.

## Testing And Build Instructions

- Open directly: `index.html`.
- Optional local server:

```powershell
python -m http.server 8000
```

- Repo checks:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repo.ps1
```

- Publish the rolling live build after routine root app changes:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\publish-live.ps1 -Label "v0.20.1 live cleanup"
```

- Publish a preserved numbered docs snapshot only for significant milestones or when explicitly requested:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\publish-snapshot.ps1 -SnapshotNumber 10 -Label "v0.13.0 feature snapshot"
```

- Node and Python may not be installed in every local environment. Use the PowerShell checks as the reliable repo-native guard.

## Coding Conventions

- Keep the app static and dependency-free unless the user explicitly chooses a larger tooling change.
- Follow existing global-function module order: core, techniques, practice, progress, init.
- Keep storage keys stable and normalize old browser-local data in `app-core.js`.
- Prefer small, focused functions and existing helpers over new abstractions.
- Keep user-facing copy consistent with the workout/training language.
- Use ASCII in source where practical; use escapes such as `\u00f7` for special symbols when centralizing display text.
- Do not edit archived `docs/v*` snapshots manually except through the snapshot publishing flow or a targeted release fix. Routine live updates should overwrite `docs/live` through `scripts/publish-live.ps1`.

## Lesson Content Workflow

- The user is the pedagogy source of truth for lesson explanations, scaffolds, mental models, worked examples, misconceptions, and feedback language.
- Do not invent explanations, scaffolds, mental models, examples, or feedback language unless the user explicitly asks Codex to draft them.
- Preserve teacher-authored wording. When structure or formatting must change, keep the wording intact and call out any unavoidable edits.
- Prefer teacher specs in `learn/specs/` and structured lesson data in `learn/lessons/` over hardcoded lesson text in JavaScript.
- Keep lesson content changes separate from renderer, state, styling, and refactor changes whenever possible.
- Keep lesson-content edits small and reviewable. One lesson or one tightly related group of fields is usually the right scope.
- Use `learn/scaffolds/`, `learn/mental-models/`, and `learn/review/` for supporting teacher-authored notes before promoting content into app-ready lesson data.
- Do not change visible lesson behavior when the task is only to capture or refine teacher-authored content.

## AI Continuity File Rules

- Ownership: `AGENTS.md`, `ai/`, and `docs/decisions/` are Codex-managed project memory. The user should not need to maintain them manually.
- The user may review or ask for changes, but Codex is responsible for keeping these files current during session start/close.
- `README.md`, `CHANGELOG.md`, and `PROJECT_NOTES.md` remain project docs, not replacements for the AI continuity layer.
- `ai/context.md`: stable facts that should rarely change.
- `ai/current-state.md`: current implementation state after recent work.
- `ai/task-map.md`: routing guide from task type to files, pre-reads, docs, and risks.
- `ai/open-threads.md`: unresolved product, design, and technical questions.
- `ai/tasks/next-actions.md`: safest next tasks, ordered by low-risk usefulness.
- `ai/session-log.md`: dated summaries of what changed and what was learned.
- `ai/prompts/session-start.md`: reusable prompt/checklist for beginning a session.
- `ai/prompts/session-close.md`: reusable prompt/checklist for ending a session.
- Keep entries concise. Link to code/docs by path when useful.
- Do not duplicate the whole README or changelog; summarize and point to them.
