# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** Phase 0 in progress
**Branch:** wt/upgrade-seo-fouc | **Worktree:** personal-website-wt-upgrade-seo-fouc
**Last completed:** Build, typecheck, and route smoke verification
**In progress:** Route generation check
**Next:** Phase 1 - Fix FOUC

## Blockers
`pnpm exec tsr generate` is not available in this checkout; `src/routeTree.gen.ts` is present and the build/typecheck passed.

## Active worktrees
| Name | Path | Status |
|------|------|--------|
| main | ./ | stable |
| upgrade-seo-fouc | ../personal-website-wt-upgrade-seo-fouc | in progress |

## Key decisions
| Date | Decision | Why |
|------|----------|-----|
| 2026-03-31 | TanStack-only upgrade | Minimize risk for the upgrade pass |

---
_Updated: 2026-03-31
