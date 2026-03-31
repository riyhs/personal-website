# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** CSS fix complete and verified — Docker prod build serves styles correctly
**Branch:** experiment | **Worktree:** personal-website
**Last completed:** Fixed CSS 404 in Docker prod builds (replaced `?url` import with side-effect import), verified with Playwright tests, documented fix in lessons.md, cleaned up temp files
**In progress:** None — ready for commit and merge
**Next:** Commit all changes on experiment branch, then merge to main when ready

## Blockers
None.

## Active worktrees
| Name | Path | Status |
|------|------|--------|
| main | ./ | stable |

## Key decisions
| Date | Decision | Why |
|------|----------|-----|
| 2026-03-31 | TanStack-only upgrade | Minimize risk for the upgrade pass |
| 2026-03-31 | Deterministic UTC date formatting | Avoid SSR/client locale drift in hydration |
| 2026-03-31 | ScriptOnce for theme bootstrap | Reduce FOUC before hydration |
| 2026-03-31 | ThemeProvider initialState='dark' | Match SSR during hydration, sync from DOM in useEffect |
| 2026-03-31 | Replace `?url` CSS import with side-effect import | `?url` produces different hashes in client vs SSR environments on Linux, causing 404. Side-effect import lets TanStack Start manifest handle `<link>` injection from client bundle |

---
_Updated: 2026-03-31
