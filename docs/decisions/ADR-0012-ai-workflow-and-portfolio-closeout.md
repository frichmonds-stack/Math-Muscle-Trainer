# ADR-0012: Routed AI Workflow And Portfolio Closeout

Date: 2026-09-25
Status: Accepted

## Context

The first AI continuity system in ADR-0001 required several startup reads and accumulated session chronology. Its completed active task remained in the operational slot. Budgie and Spellcraft now use routed context, replacement-first documentation, and AI Project Manager closeout. The owner asked for the modern command pattern and approved Notion closeout for this project.

## Decision

- Use `AGENTS.md` as the entry point and `ai/INDEX.md` plus task routes to load only relevant hot, warm, or cold context.
- `execute now` owns one local implementation batch, its checks, and matching documentation. `Chunk Plan` and `Build Prompt` are planning commands. `Publish Close` owns release verification, Git delivery, and portfolio closeout. Retire `Normal Close`.
- Replace stale current statements at their canonical home. Freeze `ai/session-log.md`; Git owns new chronology. Clear completed content from `ai/active-task.md` and next-action queues.
- Opt into AI Project Manager Notion Work Queue connector delivery through committed `.ai-efficiency.toml`. Curate only the current item and selected cross-project next actions or decision-ready threads. Preserve Sync Keys in `ai/portfolio-identities.md`; repository documents remain authoritative.
- Notion delivery starts only after the opt-in is committed. Connector delivery requires manifest-based upsert and exact local acknowledgement. No direct REST fallback or Work Queue schema change is part of closeout.

## Consequences

- Normal task initialization reads less documentation and avoids historical handoff text as current truth.
- Local implementation ends with its own checks and matching docs; a later `Publish Close` verifies and publishes that batch.
- Notion receives a narrow work summary rather than lesson content, learner data, code, paths, or technical evidence. If the connector or identity reconciliation is unavailable, delivery remains pending and is reported.
- ADR-0001 remains useful history but is superseded on startup scope, session chronology, and closeout commands.
