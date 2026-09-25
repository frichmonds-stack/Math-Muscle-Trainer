# ADR-0001: Repo-Local AI Continuity System

Date: 2026-05-07

## Status

Accepted

Superseded in part by ADR-0012 for context loading, session chronology, and command closeout. This ADR remains the historical basis for repo-local continuity ownership.

## Context

This project is developed through repeated AI-assisted sessions. Chat history is not a reliable source of project memory, and the app has accumulated product decisions, release workflow details, and implementation conventions that future sessions need quickly.

The repo already has `README.md`, `CHANGELOG.md`, and `PROJECT_NOTES.md`, but those files are not optimized as a concise AI handoff protocol.

## Decision

Use repo-local AI continuity files:

- `AGENTS.md` for Codex-readable project guidance.
- `ai/context.md` for stable project context.
- `ai/current-state.md` for current implementation state.
- `ai/active-task.md` for the one current authorized operational batch.
- `ai/open-threads.md` for unresolved questions.
- `ai/tasks/next-actions.md` for safe next tasks.
- `ai/session-log.md` for dated session summaries.
- `ai/prompts/session-start.md` and `ai/prompts/session-close.md` for repeatable session protocols.

Session startup should be layered:

- always read `AGENTS.md`, `ai/context.md`, `ai/current-state.md`, `ai/active-task.md` when active, and `git status --short`
- read `ai/task-map.md`, `ai/open-threads.md`, `ai/tasks/next-actions.md`, `ai/session-log.md`, and other route/spec/design docs only when the task needs them

Use this source-of-truth order when docs conflict:

1. current local code, tests, diffs, and working-tree evidence
2. the active authorized task
3. accepted ADRs
4. `ai/current-state.md`
5. task-specific specs, lesson files, design docs, and route docs
6. `ai/open-threads.md` and `ai/tasks/next-actions.md`
7. product-direction, roadmap, and idea-bank docs
8. `ai/session-log.md` and `CHANGELOG.md` as historical records

Continuity maintenance is conditional, not automatic. Update continuity files only when their underlying content changed materially.

Future sessions should create additional ADRs in `docs/decisions/` for lasting architectural, product, storage, release, or workflow decisions.

## Consequences

- Future Codex/GPT sessions have a predictable starting point.
- Session close work updates compact repo-local memory only when the underlying state actually changed.
- Codex owns routine maintenance of `AGENTS.md`, `ai/`, and `docs/decisions/`; the user should not need to edit those files manually.
- The continuity files must stay concise to remain useful.
- `ai/active-task.md` should not become a permanent archive; durable decisions and state belong in their long-lived destinations.
- Product direction, roadmap, and idea-bank material can live outside `ai/` so startup files stay compact.
