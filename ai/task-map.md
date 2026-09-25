# AI Task Map

Use this file to choose the smallest relevant route before editing. Do not read every route by default.

## Quick Routing

- App startup, shell, view wiring, debug entry, or screen ownership:
  - `ai/routes/app-structure.md`
- Workout flow, setup snapshots, timers, answer handling, or completion:
  - `ai/routes/workout-logic.md`
- Fact pools, operations, ranges, or question selection:
  - `ai/routes/question-generation.md`
- Learn menu, lesson rendering, stage flow, or lesson UX:
  - `ai/routes/learn.md`
- Teacher-authored lesson specs or structured lesson content:
  - `ai/routes/lesson-content.md`
- Results, records, mastery, fact tracking, dashboards, or evidence UI:
  - `ai/routes/progress.md`
- `localStorage`, migrations, saved progress, preferences, or compatibility:
  - `ai/routes/storage.md`
- Visual hierarchy, controls, design docs, or UI-system work:
  - `ai/routes/ui.md`
- Docs publishing, live/snapshot flow, version alignment, or release checks:
  - `ai/routes/publishing.md`
- Continuity docs, ADRs, prompt templates, or repo process maintenance:
  - `ai/routes/ai-continuity.md`

## Read First Rules

- Start with `AGENTS.md`, `git status --short`, and the first relevant route in `ai/INDEX.md`.
- Read `ai/active-task.md` only when a batch is active; read `ai/current-state.md` or `ai/context.md` only when the task needs them.
- Read `ai/open-threads.md` for owner decisions. `ai/session-log.md` is frozen history, not startup context.

## Source-Of-Truth Reminder

When docs disagree, prefer:

1. local code and working-tree evidence
2. the active authorized task
3. accepted ADRs
4. `ai/current-state.md`
5. the route/spec/design docs selected by the task
