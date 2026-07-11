# Session Start Prompt

Use this at the start of a future AI coding session.

## Initialization

1. Read `AGENTS.md`.
2. Always read `ai/context.md` and `ai/current-state.md`.
3. Read `ai/active-task.md` when an active task exists.
4. Run or inspect `git status --short`.

## Read Only When Relevant

- `ai/task-map.md` for unfamiliar routing
- `ai/open-threads.md` for owner decisions or planning
- `ai/tasks/next-actions.md` for future-work selection
- `ai/session-log.md` for historical context
- relevant ADRs, route docs, product docs, design docs, specs, or lesson files selected by the task

## Startup Report

State:

- current repo state
- active-task status, if any
- relevant source-of-truth docs selected for the task
- intended change or investigation
- authorization status
- likely checks

After initialization, default to discussion/planning mode until the user explicitly authorizes repo changes.
