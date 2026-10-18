# ADR-0015: Split Stylesheets In Cascade Order

Date: 2026-10-18
Status: Accepted

## Context

`styles.css` had grown to about 8,150 lines with no sections, many duplicate selectors, a trailing "Session override" block, and about 100 unused class names. A cascade audit showed the file was already mostly ordered by screen, but that regrouping rules by screen would change the cascade in at least six places.

## Decision

- Remove dead declarations, the session-override block, and certainly unused selectors from the single file first, verified by pixel-identical screenshots.
- Then split the cleaned file into `css/NN-area.css` files by cutting it at top-level rule boundaries only, in the original order. The files joined in name order match the cleaned file apart from blank lines between rules, so the cascade is unchanged.
- `index.html` links every `css/*.css` file in name order. `scripts/check-repo.ps1` and `scripts/check-repo.mjs` fail if the links and the files disagree.
- Publish and check scripts discover `css/*.css` and `js/*.js` by pattern instead of listing files by name.

## Consequences

- The numeric prefix is the cascade order. A new file must be named so that its position in name order is where its rules belong in the cascade.
- Some files still mix areas: light-mode overrides sit in `02-base.css`, and breakpoint rules for every screen sit in `14-responsive.css`. Regrouping them by screen is a separate, optional step that must be screenshot-verified.
- Uncertain selectors (built dynamically or possibly unused) and the unreachable `frozen` theme remain until checked individually.
