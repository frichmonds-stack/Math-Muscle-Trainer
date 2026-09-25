# Execute Now Procedure

Use when the owner explicitly authorizes local implementation of the agreed batch.

1. State the batch scope and exclusions. Confirm the repository root and inspect `git status --short`; preserve unrelated work.
2. Read the relevant `../task-map.md` route, source, and narrowly relevant state or spec. For teacher-authored lesson material, obey `../../AGENTS.md`'s Lesson Content Workflow.
3. Implement only this batch. An `execute now` authorization includes local file edits, relevant checks, and matching documentation updates. It does not authorize publishing `docs/live`, committing, pushing, Cloudflare deployment, or a further batch.
4. Run the checks implicated by the change. The reliable repo-wide check is `scripts/check-repo.ps1`; use narrower syntax or manual UI checks when appropriate. Say what could not be verified.
5. Update docs for what landed using `documentation-write.md`: current state only if implementation or verified state changed, task and decision queues only when their content changed, an ADR for a lasting decision, and user docs or changelog when relevant. Do not append to `../session-log.md`.
6. Report files changed, docs updated, checks and results, GitHub push and live verification status, assumptions, and manual review needed. Return to planning mode after the batch.
