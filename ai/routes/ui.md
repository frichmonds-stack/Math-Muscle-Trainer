# Route: UI

## Relevant Files

- `css/*.css` (name order is cascade order; see ADR-0015)
- `tools/visual-check/` for screenshot comparison, screen-fit checks, review sheets and smoke checks (ADR-0016)
- `index.html`
- generated markup in `js/app-progress-*.js` and `js/app-techniques-*.js`
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
- crowding a screen past what fits at the seven reference sizes, or shrinking controls too far (check the fit report)

## Owner Decisions That May Be Required

- new design-system rules
- screen ownership changes
- future external primitive adoption proof of concept

## Data / Compatibility Implications

- low unless UI changes alter stored settings, progress flow, or route ownership

## Minimum Local Checks

- visual review, using the debug-mode Screen size preview for other devices
- for layout changes: `tools/visual-check/run-all.sh --review <appDir>` (fit report plus review sheet)
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
