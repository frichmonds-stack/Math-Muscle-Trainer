# ADR-0005: Lesson Content Workflow

Date: 2026-05-08

## Status

Accepted

## Context

Learn / Techniques lesson text currently lives inside the app JavaScript. Future lesson refinement needs a workflow where teacher-authored pedagogy can be reviewed before renderer or app-state changes are made.

## Decision

Lesson content refinement starts in `learn/`:

1. Teacher spec in `learn/specs/`
2. Structured lesson data in `learn/lessons/`
3. Renderer implementation
4. Teacher review notes in `learn/review/`
5. Small commit

The user is the pedagogy source of truth. Codex must preserve teacher-authored wording and must not invent explanations, scaffolds, mental models, examples, misconceptions, or feedback language unless explicitly asked.

Content changes should be kept separate from renderer/refactor changes whenever possible.

## Consequences

- Teacher review can happen before content reaches app code.
- Future lessons should prefer structured lesson data over hardcoded lesson text.
- Empty workflow directories use `.gitkeep` files so the intended folder structure is preserved in Git.
