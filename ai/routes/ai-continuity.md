# Route: AI Continuity

## Relevant Files

- `AGENTS.md`
- `ai/INDEX.md`
- `ai/context.md`
- `ai/current-state.md`
- `ai/active-task.md`
- `ai/task-map.md`
- `ai/routes/`
- `ai/open-threads.md`
- `ai/tasks/next-actions.md`
- `ai/session-log.md`
- `ai/portfolio-identities.md`
- `ai/procedures/`
- `ai/prompts/`
- `docs/decisions/ADR-0012-ai-workflow-and-portfolio-closeout.md`

## Required Pre-Reading

- `AGENTS.md`
- `ai/INDEX.md`
- the procedure or current-state document implicated by the task

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
- appending chronology to the frozen `ai/session-log.md`
- delivering Notion items without stable Sync Key reconciliation or committed opt-in

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
- confirm `Normal Close` is not offered as a current command

## Documentation Impact

- this route is itself documentation work; related files usually change together

## ADR Trigger

- required for durable workflow or continuity-system decisions
