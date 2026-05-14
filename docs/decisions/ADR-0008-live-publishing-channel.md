# ADR-0008: Rolling Live Publishing Channel

Date: 2026-05-14

## Status

Accepted

## Context

The project has accumulated many numbered `docs/v*` snapshots because routine "make it live" updates used the same flow as milestone archival releases. The user often wants the latest app available on GitHub Pages without preserving every polish pass as a new permanent snapshot.

## Decision

Use `docs/live/` as the rolling live channel for routine internet updates.

- Routine live updates overwrite `docs/live/`.
- Routine live updates use patch versions, for example `v0.20.1`, so the live internet build remains traceable.
- Numbered `docs/v*` snapshots are preserved release archives and should be created only for significant milestones or when explicitly requested.
- `docs/index.html` should mark `docs/live/` as the current latest live build and list preserved snapshots separately.
- `scripts/publish-live.ps1` owns the rolling live publish flow.
- `scripts/publish-snapshot.ps1` remains the archival numbered snapshot flow.

## Consequences

- The live GitHub Pages URL can be updated frequently without adding another `docs/v*` folder.
- Historical snapshots stay meaningful instead of becoming every minor polish pass.
- Repo checks must compare root app files against `docs/live/` when live is marked latest.
- Snapshot pruning can be planned separately after the live channel is stable.
