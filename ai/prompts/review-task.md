# Review Task Prompt

Use this template for code review, document review, or change review work.

## Initialization Confirmation

- Session start protocol completed
- `git status --short` inspected
- Relevant route/docs read

## Review Focus

Examine:

- correctness
- regressions
- architecture
- storage compatibility
- pedagogy impact
- accessibility
- test adequacy
- documentation drift

## Finding Levels

- `blocker`
- `should correct now`
- `safe to defer`
- `optional polish`

## Review Output

- Findings first, ordered by severity with evidence
- Open questions or assumptions
- Brief change summary only after findings
