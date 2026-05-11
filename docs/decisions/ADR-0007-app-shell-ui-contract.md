# ADR-0007: App Shell UI Contract

Date: 2026-05-11

## Status

Accepted

## Context

Recent UI passes created several individually reasonable layouts, but Progress, Results, Learn, and lesson practice screens started to feel visually inconsistent. The app direction is iPad-first, with desktop expected to look like the same app rather than a separate website adaptation.

## Decision

Use a shared app-shell contract across the main app surfaces:

- Top-right global controls are reserved for Home and Settings.
- Carousel/kicker navigation uses a fixed label space so left/right arrows do not shift between slides.
- Local selectors and actions live with the slide/content header, not with global utility controls.
- Static metric panels are display-only and do not use hover/lift affordances.
- Actionable lesson/fact tiles can use hover/focus/press states because they open lessons, start training, or drill into detail.
- Insight and coaching sections can use open columns/lists when scanning and comparison matter more than tapping every block.
- Avoid visible page-section boxes inside the app canvas unless the surface is an intentional card, dialog, or repeated item.

## Consequences

Future UI work should classify each element by role before styling it. This keeps cards, lists, chips, selectors, metric panels, and action tiles consistent without forcing every section into the same visual layout.
