# Lesson Content Workflow

This folder is for teacher-authored lesson refinement before content is wired into the app.

Workflow:

1. Teacher spec in `learn/specs/`
2. Structured lesson data in `learn/lessons/`
3. Renderer implementation in the app
4. Teacher review notes in `learn/review/`
5. Small commit

The teacher spec is the pedagogy source of truth. Codex should preserve teacher-authored wording and avoid inventing explanations, scaffolds, mental models, examples, misconceptions, or feedback language unless explicitly asked.

Keep content edits separate from renderer/refactor edits whenever possible.
