# ADR-0018: Cloudflare Deployment Trigger And Manual Promotion

Date: 2026-10-18
Status: Accepted

## Context

ADR-0013's 2026-10-16 amendment says Cloudflare Workers Builds on `main` runs `npx wrangler versions upload`, so a push uploads an inactive version and nothing goes live. On 2026-10-18, merging PR #2 (merge `4a58e56`, app `v0.20.8`) to `main` made that version live automatically. The repository does not control this: `wrangler.jsonc` has no build or deploy command and there is no CI. The build and deploy commands exist only in the Cloudflare dashboard (Worker > Settings > Build). The probable cause is a production-branch deploy command of `npx wrangler deploy`, or `versions upload` set only for non-production branches. This is unverified.

## Decision

- The deployment model is manual promotion. Each push or merge to `main` should only upload an inactive version (`npx wrangler versions upload`). The owner makes a version live from the Cloudflare dashboard (Deployments), or with `npx wrangler versions deploy` under `deploy now`.
- Owner fix, in the dashboard: in Worker > Settings > Build, confirm that the production branch is `main` and set its Deploy command to `npx wrangler versions upload`. Keep non-production branch builds off, or set them to `versions upload` as well. Check that no gradual deployment or automation promotes versions.
- Verification: after the fix, make a test push to `main` and confirm that Deployments still shows the previous version as active.
- Interim rule: until that verification passes, treat any push or merge to `main` as a deployment that requires `deploy now`.
- Even after verification, `publish close` must check the trigger state before any push or merge to `main` and stop if the push would deploy or the state is unknown (ADR-0014). Cloud sessions never push or merge to `main`.

## Consequences

- This decision supersedes the ADR-0013 amendment's claim that a push to `main` makes nothing live; that claim was never verified. It also supersedes ADR-0011's manual `npx wrangler deploy` instruction, because that command uploads and promotes in one step.
- The deploy command lives outside the repository, so the repository can record the intended configuration but cannot enforce it. Docs that state trigger behaviour point here.
- Once the test push is verified, the interim rule lifts. Record the verification date in `ai/current-state.md`.
