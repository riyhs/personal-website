# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** DESIGN.md rewritten as current-state inventory for existing site
**Branch:** dev | **Worktree:** personal-website
**Last completed:** Replaced DESIGN.md with factual current-state reference of existing site
**In progress:** None
**Next:** None

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
| 2026-06-01 | Disable TanStack router-plugin code-splitter HMR injection | Installed plugin can emit duplicate `const hot` bindings during dev reference compile for blog route; Vite React HMR still handles updates |
| 2026-06-07 | Remove duplicate `routerPlugin()` from vite.config.ts | TanStack Start internally installs router-plugin via `tanStackStartRouter()`; extra `routerPlugin()` injected duplicate `const hot` declarations across all routes |
| 2026-06-07 | Add `notFoundComponent` to root route | TanStack Router warns when unmatched paths trigger `notFoundError` with no component configured; `NotFound` component styled to match site design |
| 2026-06-07 | Extract `getButtonClasses()` helper | Reuse button visual classes across `<Link>` styled as buttons — eliminates invalid HTML (button inside a) nesting |
| 2026-06-07 | `<MotionConfig reducedMotion="user">` in RootDocument | Framer Motion globally respects `prefers-reduced-motion` OS setting — blocks transform animations, preserves opacity |
| 2026-06-07 | Guard TanStack Devtools with `import.meta.env.DEV` | `<TanStackDevtools>` doesn't auto-strip in prod; `<TanStackRouterDevtools>` does. Wrap both to prevent prod bundle bloat |
| 2026-06-07 | Extract `TwitterIcon` shared component | Eliminate duplicate inline SVG across Header and index.tsx; single source of truth |
| 2026-06-07 | Standardize opacity tokens: `text-[rgb(var(--foreground))/N]` | CSS-variable-based tokens are themeable; hardcoded `text-white/N` breaks in light mode |
| 2026-06-07 | Reframe DESIGN.md as current-state inventory | User asked for no suggestions; keep design doc factual and reflective of existing codebase |

---
_Updated: 2026-06-07
