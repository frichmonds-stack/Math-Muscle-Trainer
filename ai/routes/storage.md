# Route: Storage

## Relevant Files

- `js/app-core.js`
- `js/app-practice.js`
- `js/app-progress.js`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- `docs/decisions/ADR-0002-project-rename-to-math-muscle-trainer.md`
- `docs/decisions/ADR-0006-learning-telemetry-and-mastery.md`

## Source Of Truth

- storage constants
- normalization helpers
- load/save functions
- accepted ADRs covering keys and telemetry

## Common Risks

- breaking legacy fallback reads
- writing malformed progress objects
- changing fact-key shape without migration
- making `file://` local storage testing misleading

## Owner Decisions That May Be Required

- negative-number modeling
- new durable data fields
- long-term native-ready data shape

## Data / Compatibility Implications

- highest; storage changes can break old learner data

## Minimum Local Checks

- relevant JS syntax checks
- careful review of normalization paths

## Minimum Manual QA

- load old-like data when possible
- save progress
- reload and verify continuity

## Documentation Impact

- `ai/current-state.md`
- ADRs
- product or continuity docs if data-shape strategy changes

## ADR Trigger

- required for durable storage-shape or compatibility decisions
