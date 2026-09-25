# Session Start Prompt

Use this at the start of a future AI coding session.

## Initialization

1. Read `AGENTS.md`.
2. Confirm the repository root and inspect `git status --short`.
3. Read the first relevant route in `ai/INDEX.md`; use `ai/task-map.md` for app-area routing.
4. Read `ai/context.md`, `ai/current-state.md`, or `ai/active-task.md` only when the task needs them.

## Read Only When Relevant

- `ai/open-threads.md` for owner decisions or planning
- `ai/tasks/next-actions.md` for future-work selection
- frozen `ai/session-log.md` only for a specific historical question
- relevant ADRs, route docs, product docs, design docs, specs, or lesson files selected by the task

## Startup Report

State:

- current repo state
- active-task status, only if one exists
- relevant source-of-truth docs selected for the task
- intended change or investigation
- authorization status
- likely checks

After initialization, default to discussion/planning mode until the user explicitly authorizes repo changes. Use `ai/procedures/execute-now.md` for local implementation and `ai/procedures/closeout.md` for `Publish Close`.
