# ADR-0003: Addition Lesson Loop

Date: 2026-05-08

## Status

Accepted

## Context

The addition Techniques menu had a real Make 10 lesson and multiple planned lesson cards. Future addition lessons needed to share a consistent teaching rhythm without duplicating a custom renderer for every category.

## Decision

Addition lessons use a reusable lesson plan model made from atomic components:

1. `Idea`
2. `Practice`
3. repeated as needed for the skill
4. `Final Practice`
5. `Complete`

Each component teaches one necessary move for the skill. Final Practice mixes the component question generators so the learner applies the full strategy instead of an isolated sub-step.

Completed addition lessons are stored in technique progress with `addition:<lesson-id>` keys. The complete screen routes to an addition focused workout setup using the closest available addition difficulty preset.

## Consequences

- New addition lessons can be added by defining component copy, examples, and question generator keys.
- The menu can show completed addition lessons using the existing technique progress shape.
- Focused workout handoffs currently map to existing addition difficulty presets; a future lesson-specific workout pool could make these handoffs more exact.
