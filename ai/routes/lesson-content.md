# Route: Lesson Content

## Relevant Files

- `learn/specs/`
- `learn/lessons/`
- `learn/scaffolds/`
- `learn/mental-models/`
- `learn/review/`
- `AGENTS.md`

## Required Pre-Reading

- `AGENTS.md` lesson content workflow section
- `docs/decisions/ADR-0005-lesson-content-workflow.md`
- the specific lesson spec or lesson file being touched

## Source Of Truth

- teacher-authored lesson wording
- structured lesson files
- accepted lesson workflow ADR

## Common Risks

- inventing pedagogy without authorization
- accidentally changing meaning while reformatting
- mixing content and renderer edits in one hard-to-review batch

## Owner Decisions That May Be Required

- progression scope
- structured-data migration timing
- lesson-path sequencing

## Data / Compatibility Implications

- low for content-only changes, higher when structured lesson IDs or progress keys are involved

## Minimum Local Checks

- schema/shape sanity if structured data changes
- manual wording review against the teacher spec

## Minimum Manual QA

- only when content enters the runtime

## Documentation Impact

- lesson review notes
- `ai/open-threads.md` when content decisions stay unresolved

## ADR Trigger

- usually no, unless the content workflow or durable lesson data model changes
