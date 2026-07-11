# Route: Learn

## Relevant Files

- `js/app-techniques.js`
- `js/app-core.js`
- `index.html`
- `styles.css`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- `docs/design/visual-design-system.md`
- `docs/decisions/ADR-0004-unlocked-lesson-sections.md`

## Source Of Truth

- current lesson rendering and routing code
- accepted lesson-structure ADRs
- current design docs for lesson/task ownership

## Common Risks

- breaking lesson exit behavior
- breaking focused-workout handoffs
- confusing stage, gate, and completion logic
- mixing content changes with renderer changes without clear boundaries

## Owner Decisions That May Be Required

- lesson lock behavior
- lesson navigation patterns
- learning interaction patterns

## Data / Compatibility Implications

- lesson completion and progress keys must stay stable

## Minimum Local Checks

- relevant JS syntax checks

## Minimum Manual QA

- lesson start
- stage navigation
- gated practice
- completion
- focused-workout CTA

## Documentation Impact

- design docs
- `ai/current-state.md`
- `ai/open-threads.md` if lesson UX decisions remain unresolved

## ADR Trigger

- durable lesson-flow or learner-progression model changes
