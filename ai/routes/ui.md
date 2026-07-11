# Route: UI

## Relevant Files

- `styles.css`
- `index.html`
- generated markup in `js/app-progress.js` and `js/app-techniques.js`
- `docs/design/visual-design-system.md`
- `docs/design/component-system.md`
- `docs/design/ui-direction.md`
- `docs/design/current-button-ui.md`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- the relevant design docs above

## Source Of Truth

- current root UI implementation
- accepted ADRs affecting shell/navigation or component architecture
- canonical design docs, in this order:
  1. `docs/design/visual-design-system.md`
  2. `docs/design/component-system.md`
  3. visual references and screenshot audits
  4. `docs/design/ui-direction.md`
  5. `docs/design/current-button-ui.md`

## Common Risks

- creating new one-off component styles
- contradicting screen ownership rules
- making static metrics look tappable
- crowding the iPad frame or shrinking controls too far

## Owner Decisions That May Be Required

- new design-system rules
- screen ownership changes
- future external primitive adoption proof of concept

## Data / Compatibility Implications

- low unless UI changes alter stored settings, progress flow, or route ownership

## Minimum Local Checks

- visual review
- `git diff --check`

## Minimum Manual QA

- desktop/iPad landscape
- portrait or narrow widths if the affected screen supports them
- dark and light modes
- keyboard focus and touch target sanity

## Documentation Impact

- design docs
- `ai/current-state.md` when visible behavior changes materially
- ADRs for lasting design or architecture decisions

## ADR Trigger

- durable UI system, component ownership, shell, or accessibility-contract changes
