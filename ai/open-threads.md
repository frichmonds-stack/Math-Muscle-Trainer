# Open Threads

Last updated: 2026-05-18

These are unresolved questions. Keep this file decision-focused; put executable work in `ai/tasks/next-actions.md`.

## Learning And Content

- What should the complete Addition lesson progression/pathway look like?
- How should the app model negative-number data across storage, fact keys, telemetry, progress buckets, mastery, and reports?
- Should negative integer addition/subtraction become a dedicated lesson pathway, practice option, or later advanced mode?
- Should addition focused-workout handoffs get lesson-specific question pools instead of mapping to the nearest existing difficulty preset?
- Should multiplication lessons eventually move to the same atomic `Idea -> Practice -> Final Practice` data model as addition lessons, or keep the current shared five-section table flow?
- When should current hardcoded lesson text be migrated into `learn/lessons/` structured data and renderer-fed from there?
- Should subtraction and division get full Learn / Techniques content soon, or remain practice-only with `Coming Soon` placeholders for now?

## Progress And Mastery

- Does the first four-operation mastery scoring model feel fair after real learner data accumulates?
- Which metrics should carry the most learner-facing weight: accuracy, fluency, consistency, coverage, retention, or difficulty evidence?
- How should current rank versus best-earned rank be explained to learners?
- What learner-facing rewards, if any, should sit alongside the stronger metric set of streaks, reps, accuracy, pace, and mastery?
- Should Operation Mastery and Fact Tracker merge into one hierarchy where Fact Tracker becomes the operation-detail/evidence layer behind mastery coverage and next-focus guidance?
- What is the final learner-facing explanation for mastery ranks, score, coverage, recent performance, fluency, stability, and rank path?
- Should Progress use a consistent side rail/drawer control system across all views to reduce header/control clutter and support a future journey/mastery progression visual?
- Should the calendar eventually represent operation mix/balance with operation colors, intensity, and a special all-four-operations state, or keep goal-progress color as the primary signal?

## Onboarding And Adaptation

- What should the first-time onboarding or placement flow look like?
- Should the new `Today's Training` dashboard stay a simple handoff surface, or grow into a real adaptive daily-routine engine?
- Should the 50 reps/day daily goal remain a fixed internal default, become adaptive from recent history, or become a learner-facing training preference?
- When multi-operation workouts exist, should Home add a `Do all` CTA that runs the whole Daily Routine checklist in one workout?
- Which adaptive learning behaviors are explicit roadmap commitments versus idea-bank concepts?
- How aggressive should difficulty adaptation be for different learner profiles?

## UI And Interaction

- Should Results and Progress keep carousel-style navigation or move to tabs or section switching?
- For the app-shell direction, where should the product land on the card-vs-app spectrum for Progress and Fact Tracker long-term?
- What visual style best balances universal mastery, strength/training identity, adult usability, and primary-student accessibility?
- When the future Challenge section is ready, should it join the rounded training dock as the fourth destination, or stay inside Train until it has enough repeatable content?
- Should optional sound feedback be added, and where should mute controls live?
- Should competitive `Flex` mode be built, and what rules should define it?
- When should normal learner lesson-stage locks be restored, with debug mode preserving teacher/developer bypass?
- Which debug personas and direct lesson-stage jumps are most useful after classroom testing?
- What exact visual language should define the Learning Interaction System and Learning Feedback across typed answers, comparison buttons, multiple choice, fill blanks, and future tap/drag inputs?
- How should theme palettes map to semantic color roles so every palette keeps readable contrast across status chips, progress bars, selected states, and small text?
- Which visual reference briefs should be created after the Button & Control UI board: Surface/Card UI, Learning Interaction UI, Progress/Evidence UI, App Shell/Nav, or another grouping?
- Which current screenshots should become baseline references versus future-direction references so the app does not accidentally freeze around the current Home layout?

## Release And Process

- Should the next release add browser-level smoke tests for the main user flows?
- Should the live GitHub Pages URL be added to `README.md` now that deployment is stable?
- Should `PROJECT_NOTES.md` be pruned regularly now that `ai/` continuity owns active session handoff?
- Is the current AI continuity infrastructure too heavy, too light, or correctly balanced for fast future sessions?
- What exact versioning policy should the project use while it is still pre-`1.0.0`?

## Architecture And Data Shape

- What long-term app data shape should replace or formalize the current browser-local structures so progress, lessons, telemetry, personas, accounts, sync, and reports can move cleanly into a native app later?

## Commercialisation And Security

- What subscription model best fits the likely future rollout: individual, classroom/teacher, school, family, freemium, trial, or app-store subscription?
- What account model, if any, is needed before subscriptions, cloud sync, teacher dashboards, feedback, analytics, or student identifiers are introduced?
- What privacy/security review is required before public release, especially if the app stores learner data, accepts payments, or is used by children/students outside local-only classroom testing?
- If support exports/imports are added to debug mode, what learner consent and data-minimization rules should apply?
