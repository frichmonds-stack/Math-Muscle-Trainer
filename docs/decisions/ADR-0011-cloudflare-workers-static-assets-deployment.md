# ADR-0011: Cloudflare Workers Static Assets Deployment

Date: 2026-09-23
Status: Accepted

The assets-only Cloudflare decision remains active. Its references below to retaining GitHub Pages hosting were superseded by ADR-0013 after the owner shut Pages down.

## Context

The public site is the dependency-free static app published in `docs/live/`. The repository also needs an optional Cloudflare Workers deployment path without replacing or changing the existing GitHub Pages publishing flow.

## Decision

- Configure Wrangler in the repository root with `wrangler.jsonc`.
- Deploy `docs/live/` through Workers Static Assets under the project name `math-muscle-trainer`.
- Keep the deployment assets-only: do not add a Worker entry point, assets binding, server-side logic, package manifest, or Cloudflare service bindings.
- Use `npx wrangler deploy` from the repository root, allowing `npx` to obtain Wrangler without making it a local project dependency.
- Retain the existing `docs/live/` publishing workflow and GitHub Pages setup unchanged.

## Consequences

- The same rolling public build can be deployed to Cloudflare without a build step.
- Cloudflare deployment remains an explicit manual action unless automation is authorized later.
- The repository requires Node.js/npm only on machines that run Wrangler; the static app itself remains dependency-free.
