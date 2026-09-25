# Build Prompt Procedure

Use when the owner says `Build Prompt`. Prepare a concise prompt for another coding agent; do not edit repository files.

1. Confirm the intended batch from the conversation and inspect the relevant route and current repo evidence.
2. Include the outcome, exact scope, exclusions, files or source-of-truth pointers, teacher-content constraints if relevant, acceptance criteria, and checks.
3. State the authorization boundary explicitly: the prompt does not grant publication, commit, push, Cloudflare deployment, or unrelated batches.
4. Name any owner decision that remains unresolved. Do not fill in lesson explanations, examples, scaffolds, or feedback the owner has not supplied or asked the agent to draft.
5. Keep the prompt lean enough that the executing agent can inspect current files instead of relying on copied stale context.
