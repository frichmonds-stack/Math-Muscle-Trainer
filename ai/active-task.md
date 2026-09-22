# Active Task

Task ID: DEPLOY-2026-09-23-A
Task Name: Cloudflare Workers static-assets deployment configuration
Status: complete

## Reason

Add a minimal, optional Cloudflare Workers deployment path for the existing `docs/live/` static site.

## Owner Decisions Already Made

- The Cloudflare project name is `math-muscle-trainer`.
- Deploy only `docs/live/` through Workers Static Assets.
- Do not add Worker logic, Cloudflare service bindings, secrets, credentials, or package infrastructure.
- Do not deploy, commit, push, or alter the GitHub Pages publishing workflow.

## Scope

- Add a root `wrangler.jsonc`.
- Verify current Wrangler assets-only syntax against official Cloudflare documentation.
- Run local, non-deploying validation.
- Record the durable deployment decision.

## Explicit Exclusions

- No app HTML, CSS, or JavaScript changes
- No edits to `docs/live/`
- No Cloudflare deployment or dashboard mutation
- No GitHub Pages workflow changes
- No npm manifest, lockfile, or local Wrangler dependency

## Files Likely Affected

- `wrangler.jsonc`
- `docs/decisions/ADR-0011-cloudflare-workers-static-assets-deployment.md`
- AI continuity files required by the repository closeout protocol

## Risks

- A future `docs/live/` publish changes the content that the next Wrangler deployment will upload.
- Cloudflare account authentication and domain routing remain user-managed deployment steps.

## Acceptance Criteria

- Wrangler recognizes the repository as an assets-only Worker named `math-muscle-trainer`.
- The asset directory resolves to `docs/live/`.
- No Worker entry point, binding, package manifest, or Cloudflare service configuration is added.
- Existing app and GitHub Pages files remain unchanged by this task.

## Required Checks

- Parse `wrangler.jsonc` as JSONC-compatible JSON.
- Run Wrangler dry-run validation without deploying.
- Run `git diff --check`.
- Inspect `git status --short`.

## Documentation Impact

- Low. One deployment config and a concise durable decision record are added; the app is unchanged.

## Publication Authorization

- Cloudflare deployment is not authorized.
- GitHub Pages publication, commit, and push are authorized through Publish Close.

## Latest Verified State

- Added `wrangler.jsonc` with `name`, current `compatibility_date`, and `assets.directory` only.
- Official Cloudflare documentation confirms `main` is optional and an assets binding should be omitted for assets-only Workers.
- Wrangler 4.136.3 `deploy --dry-run` read the `docs/live/` asset set, reported no bindings, and exited without deployment.
- `git diff --check` passed.
- `scripts/check-repo.ps1` reported only the pre-existing unpublished root/live `styles.css` difference.
- Publish Close refreshed `docs/live/` and updated the latest `docs/index.html` label to `v0.20.7 Cloudflare deployment configuration and visual reference refresh`.
- After publishing, `scripts/check-repo.ps1` and `git diff --check` passed. GitHub push and live verification are pending.
