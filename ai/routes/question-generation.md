# Route: Question Generation

## Relevant Files

- `js/app-practice.js`
- `js/app-core.js`
- `js/app-progress.js`

## Required Pre-Reading

- `AGENTS.md`
- `ai/current-state.md`
- `ai/open-threads.md` if negative-number scope may matter

## Source Of Truth

- current pool builders and fact-key rules
- operation option constants and display/storage symbol mapping
- current progress parsing for facts and buckets

## Common Risks

- breaking stable fact keys
- mixing display symbols with storage symbols
- treating commutative and non-commutative operations the same
- over-narrow pools that repeat the same fact

## Owner Decisions That May Be Required

- negative-number modeling
- lesson-specific focused-workout pools
- new bucket or difficulty taxonomies

## Data / Compatibility Implications

- high; fact keys and bucket logic affect saved evidence and reports

## Minimum Local Checks

- relevant JS syntax checks
- targeted local reasoning/review of generated pools

## Minimum Manual QA

- sample facts across each operation and targeted mode
- tracker-started workouts if affected

## Documentation Impact

- `ai/current-state.md`
- `ai/open-threads.md` if new unresolved modeling questions appear
- ADR if data shape changes

## ADR Trigger

- stable fact-key, storage-symbol, or modeling-contract changes
