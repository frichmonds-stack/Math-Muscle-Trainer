# Route: Workout Logic

## Relevant Files

- `js/app-practice.js`
- `js/app-core.js`
- `js/app-progress.js`
- `js/app-techniques.js`
- `index.html`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- `docs/decisions/ADR-0003-addition-lesson-loop.md` when addition handoffs are involved

## Source Of Truth

- current setup normalization and snapshot helpers
- current workout lifecycle code
- current progress-writing behavior

## Common Risks

- bypassing settings snapshots for focused workouts
- desynchronizing timers, HUD state, and completion logic
- breaking progress writes, streaks, or records
- changing manual exit behavior accidentally

## Owner Decisions That May Be Required

- new workout modes
- adaptive-behavior exposure
- lesson-to-workout mapping changes

## Data / Compatibility Implications

- workout flow changes can affect saved progress, telemetry, and records

## Minimum Local Checks

- relevant JS syntax checks
- `scripts/check-repo.ps1` when release/publish state is affected

## Minimum Manual QA

- start workout
- complete workout
- exit workout
- focused-workout handoff
- results and progress updates

## Documentation Impact

- `ai/current-state.md`
- `CHANGELOG.md` for user-visible behavior
- possibly route docs or ADRs

## ADR Trigger

- durable workout-flow, progress-write, or setup-snapshot contract changes
