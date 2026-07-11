# Route: App Structure

## Relevant Files

- `index.html`
- `js/app-init.js`
- `js/app-core.js`
- `js/app-techniques.js`
- `js/app-debug.js`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- `docs/decisions/ADR-0007-app-shell-ui-contract.md`

## Source Of Truth

- local root markup and script order
- current startup/rendering code
- accepted ADRs affecting shell ownership and navigation

## Common Risks

- shared globals depend on script order
- duplicate IDs break bindings and repo checks
- view targets must stay aligned across markup and JS
- debug mode is a classroom gate, not real security

## Owner Decisions That May Be Required

- startup-surface changes
- dock destination changes
- screen ownership changes across Home, Setup, Learn, Progress, Options, or Debug

## Data / Compatibility Implications

- startup and routing changes can affect saved setup snapshots, debug entry, or focused-workout handoffs

## Minimum Local Checks

- relevant syntax checks if JS changes
- `scripts/check-repo.ps1` when publishing or when structure changes affect docs/live expectations

## Minimum Manual QA

- startup path
- dock navigation
- Options/dialog ownership
- debug unlock path if touched

## Documentation Impact

- likely `ai/current-state.md`
- possibly design docs or ADRs if shell ownership changed

## ADR Trigger

- required for lasting shell/navigation ownership or startup-flow decisions
