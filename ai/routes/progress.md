# Route: Progress

## Relevant Files

- `js/app-progress.js`
- `js/app-practice.js`
- `js/app-core.js`
- `index.html`
- `docs/design/visual-design-system.md`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- `docs/decisions/ADR-0006-learning-telemetry-and-mastery.md`

## Source Of Truth

- current evidence-writing and rendering code
- mastery ADR and current local UI behavior
- current design docs for evidence/metric ownership

## Common Risks

- breaking shared renderers between Results and Progress
- confusing display-only metrics with interactive tiles
- changing mastery meaning without updating docs
- destabilizing operation filters or tracker training entry points

## Owner Decisions That May Be Required

- mastery explanation model
- evidence hierarchy
- Home versus Progress ownership of certain recommendations

## Data / Compatibility Implications

- high; evidence views depend on saved progress and telemetry normalization

## Minimum Local Checks

- relevant JS syntax checks

## Minimum Manual QA

- workout log
- mastery
- fact tracker
- records
- home snapshot if shared data or renderers change

## Documentation Impact

- `ai/current-state.md`
- design docs
- `ai/open-threads.md` for unresolved mastery or evidence decisions

## ADR Trigger

- durable mastery-model or progress-architecture changes
