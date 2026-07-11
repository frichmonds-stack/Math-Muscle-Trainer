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
  - `js/app-debug.js` - opt-in teacher/developer debug mode, loaded only through `?debug=1` / `#debug` behavior.
- The rolling live GitHub Pages build lives under `docs/live`; preserved static snapshots live under `docs/v*`; `docs/index.html` marks the current live build and lists preserved snapshots.
- Project memory is split across `docs/product/`, `AGENTS.md`, `ai/`, and `docs/decisions/`.
- Current product name is `Math Muscle Trainer`; avoid reintroducing prior product branding except when discussing external/manual rename history.

## Session Start Protocol

1. Read this file first.
2. Always read:
   - `ai/context.md`
   - `ai/current-state.md`
   - `ai/active-task.md`, when it contains an active task
3. Inspect `git status --short` before editing.
4. Read only what the task needs:
   - `ai/task-map.md` when routing unfamiliar work
   - `ai/open-threads.md` for planning or owner decisions
   - `ai/tasks/next-actions.md` when selecting future work
   - `ai/session-log.md` only when historical context is required
   - relevant ADRs, route docs, lesson files, specs, design docs, or product docs chosen by the task
5. Summarize the current repo state and the intended change before changing code.
6. For work affecting product direction, architecture, release flow, storage shape, design systems, or long-lived conventions, create or update an ADR in `docs/decisions/`.

## Source-Of-Truth Order

When repo information conflicts, use this order:

1. Current local code, tests, diffs, and working-tree evidence
2. The active authorized task in `ai/active-task.md`
3. Accepted ADRs in `docs/decisions/`
4. `ai/current-state.md`
5. Task-specific specs, lesson files, design docs, and route docs
6. `ai/open-threads.md` and `ai/tasks/next-actions.md`
7. Product-direction, roadmap, and idea-bank docs
8. `ai/session-log.md` and `CHANGELOG.md` as historical records

GitHub is the remote published state, but newer local evidence wins when the working tree or user-provided context proves it is newer.

Historical records must not silently override current code or accepted decisions.

## Post-Initialization Collaboration Rule

After completing the Session Start Protocol, default to discussion/planning mode. Codex may inspect files, run read-only discovery commands, and propose plans, but must not change repo state until the user explicitly authorizes implementation.

Changing repo state includes editing files, updating AI continuity docs, running publish scripts, creating generated build outputs, installing dependencies, changing saved app data, committing, or pushing.

Implementation and release scope must follow the user's explicit wording:

- `execute now`, `go ahead`, `make the changes`, `implement this`, `fix it`, or `update the files` authorizes local file changes only.
- `Normal Close` or `Run the session close protocol from AGENTS.md and update the AI continuity files` authorizes local session-close work: best available checks, affected local docs, conditional AI continuity updates, and final status reporting. It does not authorize publishing `docs/live`, creating snapshots, committing, pushing, or claiming live verification.
- `Publish Close` authorizes release-style closeout: version/changelog updates when needed, publishing the appropriate docs build, usually `docs/live` for routine updates, running repo checks after publish, checking status/remotes, committing, pushing, and verifying the live GitHub Pages build when deployment timing allows.
- `publish`, `commit`, and `push` authorize only those named release steps when paired with an implementation or closeout request.

Vague approval such as `sounds good` should be treated as continued discussion unless the user clearly asks for action.

## Active Task Record

- `ai/active-task.md` is the operational record for the one implementation or investigation batch that is currently live.
- Normally only one task should be active at a time.
- Use statuses: `proposed`, `authorized`, `implementing`, `review`, `complete`.
- Keep active-task content focused on the current batch: reason, decisions made, scope, exclusions, likely files, risks, checks, publication authorization, and latest verified state.
- When a task is complete, move durable information to the right long-lived destination instead of letting `ai/active-task.md` become a permanent scrapbook.

## Session Close Protocol

Before finishing a coding session:

1. Run the best available checks for the change.
2. Update documentation affected by the work:
   - `README.md` for user-facing features, run/check/publish steps, or repo structure
   - `CHANGELOG.md` and `APP_VERSION` for user-visible behavior or releases
   - `docs/index.html` and `docs/live` via `scripts/publish-live.ps1` for routine live updates
   - `docs/index.html` and `docs/v*` via `scripts/publish-snapshot.ps1` only for preserved numbered snapshots
   - product, design, lesson, or process docs that materially changed
3. Update AI continuity only when the content actually changed:
   - `ai/current-state.md` only when implementation or verified project state changed
   - `ai/tasks/next-actions.md` only when priorities or readiness changed
   - `ai/open-threads.md` only when a decision appears, changes, becomes blocked, or closes
   - `ai/session-log.md` only for meaningful implementation, investigation, decision, release, or handoff milestones
4. Create or update an ADR only for a durable architecture, product, data, design, release, security, or workflow decision.
5. It is acceptable to report `AI continuity: no update required` when nothing material changed.
6. For release/publish work, or when the user asks for changes to be live:
   - Run `scripts/check-repo.ps1` after publishing `docs/live` or a numbered snapshot
   - Check `git status --short` and `git remote -v`
   - Commit and push only when the user requested or approved publishing
   - Verify the GitHub Pages/live URL when network access and deployment timing allow
7. In the final response, explicitly state:
   - files changed
   - docs updated
   - checks run
   - GitHub push status
   - live internet verification status
   - assumptions and manual review still needed
8. Do not claim GitHub is updated or the site is live unless it was actually pushed and verified. If not done, say exactly what remains.

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
- The user may review or ask for changes, but Codex is responsible for keeping these files current when the underlying project memory actually changes.
- `README.md` and `CHANGELOG.md` remain project docs, not replacements for the AI continuity layer.
- `docs/product/product-direction.md` holds durable product positioning and constraints.
- `docs/product/roadmap.md` holds broad sequencing and future workstreams.
- `docs/product/idea-bank.md` holds speculative concepts that are not commitments.
- `ai/context.md` holds stable facts that rarely change.
- `ai/current-state.md` holds the compact present-tense project snapshot.
- `ai/active-task.md` holds the one active operational batch.
- `ai/task-map.md` routes work to `ai/routes/*.md`.
- `ai/open-threads.md` holds unresolved decisions, not executable tasks.
- `ai/tasks/next-actions.md` holds a small priority queue of concrete next work.
- `ai/session-log.md` records meaningful milestones and may later archive old entries into yearly files.
- `ai/prompts/` holds reusable task and closeout templates.
- Keep entries concise. Link to code/docs by path when useful.
- Do not duplicate the whole README, changelog, or product docs; summarize and point to them.
