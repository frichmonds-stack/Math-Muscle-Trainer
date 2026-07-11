# Session Close Prompt

Use this before ending a future AI coding session.

## Closeout Mode

- `Normal Close`: local checks, affected local docs, conditional AI continuity updates, and final status reporting only
- `Publish Close`: release-style closeout with publishing, post-publish checks, status/remotes review, commit/push when approved, and live verification when possible

## Closeout Checklist

1. Run the best available checks.
2. Update only the docs that the work actually changed.
3. Update AI continuity only where the underlying state changed.
4. Add or update an ADR only for durable decisions.
5. For publish work, run the appropriate publish flow, rerun checks, inspect `git status --short`, inspect `git remote -v`, and verify live only if it was actually pushed and reachable.

## Final Report

Include:

- files changed
- docs updated
- checks run
- GitHub push status
- live internet verification status
- AI continuity updates, or `AI continuity: no update required`
- assumptions
- manual review still needed

Do not claim GitHub is updated or the site is live unless that was completed and verified.
