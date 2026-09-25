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
- The rolling publishable build lives under `docs/live`; preserved static snapshots live under `docs/v*`. GitHub Pages is shut down. Cloudflare Workers is configured for `docs/live` but has not been deployed.
- Project memory is split across `docs/product/`, `AGENTS.md`, `ai/`, and `docs/decisions/`.
- Current product name is `Math Muscle Trainer`; avoid reintroducing prior product branding except when discussing external/manual rename history.

## Session Start Protocol

1. Read this file first, then run `git status --short` and confirm the repository root before editing.
2. Read the first relevant route in `ai/INDEX.md`; follow `ai/task-map.md` for an app area. Read current state, a task, an ADR, or a spec only when the task implicates it. `ai/session-log.md` is frozen history, never startup context.
3. State the intended change and whether edit authorization exists before changing files.
4. For lasting product, architecture, release, storage, design-system, or workflow decisions, add or update an ADR in `docs/decisions/`.

## Context Tiers

`ai/INDEX.md` labels AI-facing documents: **Hot** routing and operational rules, **Warm** task-relevant state and design, and **Cold** history. Load the narrowest relevant route first. A document's importance does not make it a startup read.

## Source-Of-Truth Order

When repo information conflicts, use this order:

1. Current local code, tests, diffs, and working-tree evidence
2. The active authorized task in `ai/active-task.md`, when one exists
3. Accepted ADRs in `docs/decisions/`
4. `ai/current-state.md`
5. Task-specific specs, lesson files, design docs, and route docs
6. `ai/open-threads.md` and `ai/tasks/next-actions.md`
7. Product-direction, roadmap, and idea-bank docs
8. Git, the frozen `ai/session-log.md`, and `CHANGELOG.md` as historical records

GitHub is the remote published state, but newer local evidence wins when the working tree or user-provided context proves it is newer.

Historical records must not silently override current code or accepted decisions.

## Post-Initialization Collaboration Rule

After completing the Session Start Protocol, default to discussion/planning mode. Codex may inspect files, run read-only discovery commands, and propose plans, but must not change repo state until the user explicitly authorizes implementation.

Changing repo state includes editing files, updating AI continuity docs, running publish scripts, creating generated build outputs, installing dependencies, changing saved app data, committing, or pushing.

Implementation and release scope must follow the user's explicit wording:

| Command | Scope |
|---|---|
| `execute now` (or an equally explicit edit request) | Implement the agreed local batch, run relevant checks, and update affected docs. Follow `ai/procedures/execute-now.md`. No commit, push, or deployment. |
| `Chunk Plan` | Split a proposed batch into owner-selectable chunks; follow `ai/procedures/chunk-plan.md`. No edits. |
| `Build Prompt` | Prepare a scoped prompt for another agent; follow `ai/procedures/build-prompt.md`. No edits. |
| `Publish Close` | Follow `ai/procedures/closeout.md`: verify, publish the appropriate local `docs/` build when needed, commit and push, then submit the AI Project Manager return and authorized Notion closeout. Cloudflare deployment requires an explicit deployment request. |

An explicit request to `publish`, `commit`, or `push` authorizes only the named step. A local implementation request does not imply one of those steps.

Vague approval such as `sounds good` should be treated as continued discussion unless the user clearly asks for action.

## Active Task Record

- `ai/active-task.md` is the operational record for the one implementation or investigation batch that is currently live.
- Normally only one task should be active at a time.
- Use statuses: `proposed`, `authorized`, `implementing`, `review`, `complete`.
- Keep active-task content focused on the current batch: scope, exclusions, decisions, checks, and latest verified state.
- When a task is complete, move durable information to the right long-lived destination instead of letting `ai/active-task.md` become a permanent scrapbook.

## Documentation And Closeout

- During `execute now`, run the relevant checks and update docs for what actually landed. Use `ai/procedures/documentation-write.md`: replace superseded text at its canonical home, prune finished tasks, and avoid new session summaries.
- `Publish Close` verifies the completed batch, handles version and `docs/` publishing when relevant, checks the repository, commits and pushes, and reports what was actually verified. Follow `ai/procedures/closeout.md`.
- `.ai-efficiency.toml` opts into connector-based Notion Work Queue closeout after its configuration is committed. The repository remains authoritative; Notion receives only a curated portfolio summary. Use stable keys in `ai/portfolio-identities.md` and the procedure above. Do not submit or claim Notion delivery during an ordinary local implementation turn.

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
- `ai/session-log.md` is frozen historical context; Git owns new chronology.
- `ai/portfolio-identities.md` records only stable Notion Sync Keys for curated items.
- `ai/procedures/` holds command and documentation workflows; `ai/prompts/` holds optional reusable prompts.
- Keep entries concise. Link to code/docs by path when useful.
- Do not duplicate the whole README, changelog, or product docs; summarize and point to them.
