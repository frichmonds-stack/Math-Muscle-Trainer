# ADR-0004: Unlocked Lesson Sections

Date: 2026-05-08

## Status

Accepted

## Context

Learn / Techniques lessons originally used staged progress pills that locked later sections until earlier work was completed. The learner should be able to inspect lesson content without having to perform every practice step first.

## Decision

Lesson section pills are unlocked by default for multiplication and addition lessons. Learners can jump directly to any idea, practice, final practice, or completion section from the pill row.

Multiplication table lessons use the existing five-part flow:

1. `Idea #1`
2. `Idea #2`
3. `Warm Up`
4. `Assisted Reps`
5. `Solo Reps`

Each table from `x1` through `x12` has table-specific strategy copy, examples, hints, and completion copy while sharing the same renderer.

## Consequences

- Lessons are easier to review and inspect during design/content iteration.
- Practice completion still records progress, but content visibility no longer depends on completion.
- Future lesson types should default to open section navigation unless a deliberate assessment mode is added.
