# AI Index

Use this folder for AI workflow, current implementation state, and next work. Product direction lives in `../docs/product/`; lasting decisions live in `../docs/decisions/`. Git owns new chronology.

**Hot** files are routing or operational rules, **Warm** files are read when the task implicates them, and **Cold** files are history retrieved only when needed. Read the first relevant route rather than every file here.

| Need | File | Tier |
|---|---|---|
| Choose an app area and its source files | `task-map.md` | Hot |
| Route-specific code, data, UI, or publishing guidance | `routes/` | Warm |
| Stable project facts | `context.md` | Warm |
| Present implementation and publication state | `current-state.md` | Warm |
| One currently authorized batch, if any | `active-task.md` | Warm |
| Concrete selectable work | `tasks/next-actions.md` | Hot |
| Unresolved owner decisions | `open-threads.md` | Hot |
| Permanent Notion Work Queue identities | `portfolio-identities.md` | Hot |
| Historical session milestones, frozen | `session-log.md` | Cold |
| Reusable task and session prompts | `prompts/` | Warm |

## Procedures

| Command or need | File | Tier |
|---|---|---|
| `execute now` | `procedures/execute-now.md` | Hot |
| `Chunk Plan` | `procedures/chunk-plan.md` | Hot |
| `Build Prompt` | `procedures/build-prompt.md` | Hot |
| `Publish Close` and Notion closeout | `procedures/closeout.md` | Hot |
| Place, update, or retire documentation | `procedures/documentation-write.md` | Warm |

Global authorization, source-of-truth, coding, and lesson-content rules stay in `../AGENTS.md`.
