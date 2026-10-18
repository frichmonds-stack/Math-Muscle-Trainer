# ADR-0013: GitHub Pages Shutdown

Date: 2026-09-25
Status: Accepted

## Context

The owner confirmed on 2026-09-23 that GitHub Pages was intentionally shut down. Earlier publishing ADRs described it as the public channel, and the README still presented Pages setup as the current release path.

## Decision

- Keep root app files as the development source and `docs/live/` as the rolling publishable copy produced by `scripts/publish-live.ps1`.
- Preserve numbered `docs/v*` snapshots under the existing milestone policy.
- Treat GitHub Pages as inactive. Do not use Pages checks to claim a current live deployment.
- Keep the existing optional, assets-only Cloudflare Workers configuration. Deploy it only on an explicit request; a GitHub push or local `docs/live/` refresh does not prove deployment.

## Consequences

- Release closeout reports GitHub push and live internet verification as separate facts.
- ADR-0008's rolling-copy decision and ADR-0011's assets-only Cloudflare design remain; their references to active GitHub Pages publishing are superseded by this decision.

## Amendment 2026-10-16

GitHub Pages had remained enabled and republished `/docs` on pushes to `main` until the owner
disabled it on 2026-10-16. Cloudflare Workers Builds is connected to `main` with the deploy command
`npx wrangler versions upload`: each push uploads an inactive version and nothing goes live. The
owner makes a version live by deploying it from the Cloudflare dashboard (Deployments). A push is
therefore Git publication only; going live remains a separate, explicit step.

*Superseded by ADR-0018:* "nothing goes live" was unverified; a merge to `main` promoted `v0.20.8`
automatically on 2026-10-18. ADR-0018 holds the current trigger state and interim rule.
