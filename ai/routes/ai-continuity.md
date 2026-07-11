# Route: AI Continuity

## Relevant Files

- `AGENTS.md`
- `ai/context.md`
- `ai/current-state.md`
- `ai/active-task.md`
- `ai/task-map.md`
- `ai/routes/`
- `ai/open-threads.md`
- `ai/tasks/next-actions.md`
- `ai/session-log.md`
- `ai/prompts/`
- `docs/decisions/ADR-0001-ai-continuity-system.md`

## Required Pre-Reading

- `AGENTS.md`
- `ai/context.md`
- `ai/current-state.md`
- `docs/decisions/ADR-0001-ai-continuity-system.md`

## Source Of Truth

- current local repo evidence
- the active authorized task
- accepted ADRs
- current continuity file responsibilities in `AGENTS.md`

## Common Risks

- duplicating the same fact across many files
- treating historical notes as current state
- updating continuity files automatically when nothing material changed
- letting `ai/active-task.md` become a permanent backlog

## Owner Decisions That May Be Required

- workflow changes that affect how future sessions should operate
- continuity-file scope changes

## Data / Compatibility Implications

- none for runtime data, but high for future session reliability

## Minimum Local Checks

- path/link existence
- source-of-truth consistency review
- `git diff --check`

## Minimum Manual QA

- confirm startup docs point to real files
- confirm closeout docs do not require churn unnecessarily

## Documentation Impact

- this route is itself documentation work; related files usually change together

## ADR Trigger

- required for durable workflow or continuity-system decisions
