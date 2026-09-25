# Documentation-Write Procedure

Use for documentation-only work and the documentation step of `execute-now.md` or `closeout.md`.

1. Choose the canonical destination: current facts in `../current-state.md`, executable work in `../tasks/next-actions.md`, unresolved decisions in `../open-threads.md`, lasting rulings in `../../docs/decisions/`, product intent in `../../docs/product/`, teacher-authored content in `../../learn/`, and user-facing run or publish guidance in `../../README.md`.
2. Before adding text to a live document, decide whether the new information **replaces**, **falsifies**, **makes redundant**, or **narrows** an existing statement. Edit or remove that statement in place. If it belongs elsewhere, write it at its canonical home and leave only a short pointer. Add text without replacement only for genuinely new durable truth.
3. Update `../INDEX.md` or `../task-map.md` when a routed file is created, moved, retired, or changes purpose. Check inbound references before deleting or renaming a file.
4. Keep `../tasks/next-actions.md` and `../open-threads.md` concise. Delete completed tasks; move durable conclusions to current state or an ADR. Do not preserve completion narratives in operational files.
5. `../session-log.md` is frozen history. Git holds new chronology. Preserve historical reasoning only when it prevents a future mistake, usually in an ADR.
6. Keep `CHANGELOG.md` for material release changes rather than test narration or debugging chronology. `APP_VERSION` changes when release policy requires it; a documentation-only workflow update does not by itself change the runtime version.
7. Verify changed paths and links, check for conflicting current claims, inspect the diff, and run `git diff --check`. Run `scripts/check-repo.ps1` when publish or app files are affected.
