# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** Phase 1 FOUC fix FAILED — issue remains unresolved
**Branch:** experiment | **Worktree:** personal-website
**Last completed:** Docker prod build passes, but FOUC persists at runtime
**In progress:** FOUC root cause investigation — missing light theme CSS overrides
**Next:** Add `[data-theme="light"]` color vars to `src/styles.css`, inline critical theme CSS in `<head>`

## Blockers
FOUC remains unresolved. `src/styles.css` has NO `[data-theme="light"]` overrides — only `:root` dark vars. ScriptOnce sets `dataset.theme` and `style.colorScheme` but CSS has nothing to act on. The visual flash occurs between SSR paint and CSS load.

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
| 2026-03-31 | FOUC fix attempt FAILED | Missing light theme CSS overrides — `dataset.theme` has no CSS to act on |

---
_Updated: 2026-03-31
