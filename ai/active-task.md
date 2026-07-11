# Active Task

Task ID: DOC-2026-07-11-A
Task Name: AI workflow and design-system consolidation
Status: complete

## Reason

Reduce startup duplication, make source-of-truth rules explicit, split mixed product memory into cleaner documents, and record the intended hybrid UI component architecture without changing runtime code.

## Owner Decisions Already Made

- This batch is documentation-only.
- Do not change application HTML, CSS, JavaScript, publishing scripts, tests, dependencies, or runtime behavior.
- Do not commit, push, publish `docs/live`, create a numbered snapshot, or claim live verification.
- The durable architecture decision for this batch is the hybrid internal-plus-external UI component model, not selection of a specific library.

## Scope

- AI workflow consolidation
- Active-task model
- Source-of-truth precedence
- Conditional continuity maintenance rules
- Prompt template cleanup
- Product-memory split under `docs/product/`
- AI route split under `ai/routes/`
- Design authority cleanup
- Hybrid component architecture ADR and design-doc updates

## Explicit Exclusions

- No runtime implementation changes
- No dependency or framework changes
- No CI/GitHub Actions changes
- No publish, commit, or push
- No external component library proof of concept

## Files Likely Affected

- `AGENTS.md`
- `ai/`
- `docs/product/`
- `docs/design/`
- `docs/decisions/`
- `PROJECT_NOTES.md`

## Risks

- Documentation drift if multiple files restate the same rule
- Accidentally overwriting unrelated local doc edits
- Creating route/product files that are too verbose to be useful at session start

## Acceptance Criteria

- Startup docs support layered reading instead of loading every continuity file every session.
- Source-of-truth precedence is explicit and consistent across workflow docs.
- `PROJECT_NOTES.md` is reduced to an index or removed safely.
- `ai/current-state.md`, `ai/open-threads.md`, `ai/tasks/next-actions.md`, and `ai/task-map.md` each have a narrow job.
- Design docs show one canonical authority order and no obvious contradictions with the current repo state.
- A durable ADR records the hybrid UI component architecture.

## Required Checks

- Verify all added internal paths exist.
- Verify source-of-truth statements align across AI docs.
- Verify design-doc statements match current source behavior.
- Run `git diff --check`.
- Run `scripts/check-repo.ps1` if still meaningful for documentation-only changes.
- Inspect `git status --short`.

## Documentation Impact

- High. This batch mainly restructures and consolidates repository documentation.

## Publication Authorization

- Not authorized for this batch.

## Latest Verified State

- Local source still shows Home startup, dock destinations `Home / Workout / Learn / Progress`, an Options gear in the dock, and local/live baseline `v0.20.7`.
- This task's durable outcomes were moved into `AGENTS.md`, `ai/`, `docs/product/`, `docs/design/`, and `docs/decisions/ADR-0010-hybrid-ui-component-architecture.md`.
