# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** Personal refresh built on `feat/personal-refresh` (uncommitted, awaiting user review)
**Branch:** feat/personal-refresh | **Worktree:** personal-website
**Last completed:** Light/dark toggle, colophon footer (build SHA/date), /llms.txt + /index.md server routes, Safzan-style home (hero, project rows, grouped stack, dated writing), /projects/$slug case studies, site-wide opacity-token fix
**In progress:** None
**Also done:** All pages (projects, case study, about, blog, blog detail, 404) use shared `PageHeader` + `Section` in home style; navbar uses `/public/logo.svg` (SVG copy of favicon); Takodam named only in experience; Badge/Card/ImageModal removed (orphaned)
**Also done (round 3):** CSS entrance animations (no SSR opacity:0), route transition without AnimatePresence, single canonical per page, blog post as sibling route `blog_.$slug.tsx` with 404 for unknown slugs, list-item headings h3, footer-style nav links, 4px home thumbnails
**Next:** User adds `build-args: GIT_SHA=${{ github.sha }}` to build-deploy.yml (left untouched: has user's uncommitted edits); user writes case-study prose

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
| 2026-06-07 | About page uses single-column editorial dossier layout | User disliked left-card/right-main split and wanted no separate identity facts/image block |
| 2026-06-07 | Keep `@tanstack/react-devtools` but remove `@tanstack/devtools-vite` | Preserve development devtools shell while avoiding production `removeDevtoolsOnBuild` transform that broke Router code splitting |
| 2026-08-23 | Match fetchz blur recipe: ≤12px radius on persistent blurred surfaces, tint carries opacity, no Firefox sniffing | Gecko re-filters backdrop every scroll frame; cost scales with radius × area. fetchz.vercel.app proves 12px + translucent fills stays smooth incl. Firefox mobile. Earlier kill-switch approach reverted same day |
| 2026-10-22 | Alpha inside rgb(): `text-[rgb(var(--foreground)/N)]` | Old `rgb(var(--x))/N]` form compiled to invalid CSS; muted text never rendered muted |
| 2026-10-22 | Site container max-w-6xl -> max-w-4xl | Narrow single column per safzan.dev inspiration |
| 2026-10-22 | llms.txt/index.md as TanStack server routes | Built from data modules so they stay in sync; CI builds on Node 20 so .mjs scripts can't import TS |
| 2026-10-22 | Hero/llms copy lives in `src/data/profile.ts` | Single source for page and markdown versions |

---
_Updated: 2026-10-22
