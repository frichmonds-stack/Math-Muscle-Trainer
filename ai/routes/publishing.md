# Route: Publishing

## Relevant Files

- `scripts/check-repo.ps1`
- `scripts/publish-live.ps1`
- `scripts/publish-snapshot.ps1`
- `docs/index.html`
- `docs/live`
- `docs/v*`
- `CHANGELOG.md`
- `js/app-core.js`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- `docs/decisions/ADR-0008-live-publishing-channel.md`

## Source Of Truth

- current local root app
- publish scripts
- latest released changelog/version markers

## Common Risks

- version mismatch between `APP_VERSION` and `CHANGELOG.md`
- marking the wrong docs entry as latest
- editing archived snapshots manually
- claiming live status without push and verification

## Owner Decisions That May Be Required

- whether a change should be routine live versus preserved snapshot
- whether release metadata should be updated now or later

## Data / Compatibility Implications

- low for runtime data, high for release traceability

## Minimum Local Checks

- `scripts/check-repo.ps1`
- `git diff --check`
- version/path sanity

## Minimum Manual QA

- published page loads
- expected markers/version strings after publish

## Documentation Impact

- `README.md`
- `CHANGELOG.md`
- `ai/current-state.md`
- `ai/session-log.md`

## ADR Trigger

- durable release-flow or publishing-channel changes
