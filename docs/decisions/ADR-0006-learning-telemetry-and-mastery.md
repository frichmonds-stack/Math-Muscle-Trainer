# ADR-0006: Learning Telemetry and Operation Mastery

Date: 2026-05-09

## Status

Accepted

## Context

Operation mastery ranks need stronger evidence than lifetime accuracy alone. The app already stores fact progress, daily records, bucket trends, and workout history, but future ranks and adaptive behavior also need answer-level signals such as response latency, skill coverage, session position, and repeated performance over time.

## Decision

Store a capped, browser-local `answerTelemetry` array inside the existing progress object. Each entry records:

- operation
- fact key
- skill bucket
- difficulty band
- correct/skipped state
- response time
- timestamp and date key
- session id
- session source
- session position

Keep the telemetry bounded to recent evidence and derive operation mastery from stored progress rather than storing ranks as source-of-truth data.

Store best-earned operation ranks separately from current rank calculations. Current ranks represent recent form; best-earned ranks preserve the highest rank the learner has proven so learners can move down in current evidence without losing historical achievement.

Use the rank chain:

`Rookie -> Novice -> Adept -> Expert -> Elite -> Master -> Legend`

Initial mastery scoring combines:

- accuracy
- fluency
- coverage
- retention
- consistency
- difficulty evidence

## Consequences

- Mastery ranks can be recalculated as the scoring model improves.
- Current rank can move up or down as recent evidence changes, while best-earned rank only rises.
- Existing saved progress remains valid because missing telemetry normalizes to an empty array.
- Storage remains bounded by pruning dated records and capping answer telemetry.
- Future adaptive difficulty and developmental-profile work should reuse these signals before adding new storage fields.
