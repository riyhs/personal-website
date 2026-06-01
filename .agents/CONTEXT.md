# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** Workflow migration complete — Plan -> Build -> Review docs added
**Branch:** dev | **Worktree:** personal-website
**Last completed:** Installed review/memory skills, created `reviewer` primary agent, replaced active docs with Plan -> Build -> Review workflow, added Karpathy instructions as main personality
**In progress:** None
**Next:** Restart OpenCode so new `.opencode/` agent/config and skills load

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
| 2026-06-01 | Plan -> Build -> Review is default workflow | User wants default OpenCode workflow plus read-only review agent and local markdown memory |
| 2026-06-01 | Karpathy instructions are main personality | User wants this repo's agents to always follow them |

---
_Updated: 2026-06-01
