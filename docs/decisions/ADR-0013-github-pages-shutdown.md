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
