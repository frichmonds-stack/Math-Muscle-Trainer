# Open Threads

Last updated: 2026-07-11

Keep this file decision-focused. Executable work belongs in `ai/tasks/next-actions.md`. Speculative concepts belong in `docs/product/idea-bank.md`.

## THREAD-LEARN-001

- Question: What should the full addition lesson progression look like from early fluency to advanced bridging?
- Classification: upcoming
- Why it matters: lesson authoring, structured lesson data, Learn IA, and focused-workout handoffs all depend on the progression model.
- Decision needed before: large-scale addition lesson expansion
- Known options: continue atomic `Idea -> Practice -> Final Practice` pathways, introduce a larger pathway map, or split into smaller mastery clusters.
- Owner: user
- Current status: open

## THREAD-DATA-001

- Question: How should negative-number arithmetic be modeled across fact keys, storage, telemetry, mastery, reports, and lesson pathways?
- Classification: blocking
- Why it matters: a partial implementation risks incompatible saved data and misleading mastery evidence.
- Decision needed before: adding negative-number lessons or broad negative-number workout support
- Known options: dedicated advanced pathway, practice-only option, or later extension after positive-number mastery
- Owner: user
- Current status: open

## THREAD-LEARN-002

- Question: When should the current hardcoded lesson text migrate into structured lesson data under `learn/lessons/`?
- Classification: upcoming
- Why it matters: it affects future lesson scale, review workflow, and renderer complexity.
- Decision needed before: large new lesson batches or a lesson-runner refactor
- Known options: migrate lesson-by-lesson, migrate after the Lesson Experience System brief, or keep mixed mode temporarily
- Owner: user
- Current status: open

## THREAD-PROGRESS-001

- Question: What learner-facing model should explain mastery score, current rank, best rank, coverage, and next focus?
- Classification: upcoming
- Why it matters: Progress can show more evidence than it can currently explain simply.
- Decision needed before: deeper Operation Mastery / Progress IA redesign
- Known options: keep the current temporary bridge, add a guided explainer layer, or restructure Progress around mastery evidence first
- Owner: user
- Current status: open

## THREAD-HOME-001

- Question: Should Home stay a lightweight dashboard handoff surface, or grow into a more adaptive daily-training engine?
- Classification: exploratory
- Why it matters: it affects onboarding, daily goals, routine CTAs, and what belongs on Home versus Progress.
- Decision needed before: major Home/dashboard redesign or daily-goal feature work
- Known options: keep current dashboard shape, add a smarter routine engine, or split adaptive planning into a later phase
- Owner: user
- Current status: open

## THREAD-DESIGN-001

- Question: Which specialized visual briefs should come next after the current Home/Setup/Practice reference spine?
- Classification: exploratory
- Why it matters: future UI work needs a deliberate order instead of freezing around the current Home implementation.
- Decision needed before: major Learn, Progress, or Options visual redesign work
- Known options: Lesson Experience first, then Learning Interaction, then Progress/Evidence, then App Shell/Nav
- Owner: user
- Current status: direction suggested, not finalized

## THREAD-COMMERCIAL-001

- Question: What account, subscription, privacy, and security model is required before any networked or commercial release work?
- Classification: exploratory
- Why it matters: later public release, analytics, payments, sync, and student data work should not grow without a safety model.
- Decision needed before: accounts, subscriptions, cloud sync, analytics, or public student-data features
- Known options: local-only phase first, family/individual app-store rollout, classroom/school path, or hybrid rollout
- Owner: user
- Current status: open
