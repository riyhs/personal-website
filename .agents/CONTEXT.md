# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** Upgrade committed on `chore/upgrade-tanstack-start` (5 commits, not pushed). First-visit page-fade glitch fixed in `__root.tsx` (uncommitted). Personal refresh merged to main (PR #3).
**Branch:** chore/upgrade-tanstack-start | **Worktree:** personal-website
**Last completed:** Start 1.168.49 -> 1.169.3, Router 1.170.45, router-plugin 1.168.47, router-devtools 1.167.2, Vite 7 -> 8.3.5, plugin-react 5 -> 6.1.2, Vitest 3 -> 5.0.5, nitro alpha.2 -> 3.0.260903-beta, vite-tsconfig-paths removed (Vite `resolve.tsconfigPaths`), CI Node 20 -> 24
**Verified:** tsc, 9 unit tests, prod build (21.4s -> ~11s), first-load JS 160.8 -> 158.4 KB gz, Firefox + Chromium back/forward/theme/menu/404 suite, dev server, CI build in clean node:24, Docker image (443.2 -> 427.5 MB), SSR HTML null bytes gone
**In progress:** None
**Also done (batch 2, same branch):** React 19.3.1, shiki + @shikijs/rehype 4.5.0, lucide-react 1.61.0 (local GithubIcon/LinkedinIcon, identical markup), framer-motion -> motion 14.5.0 (`motion/react`), TypeScript 6.0.3 (baseUrl removed), jsdom 30.1.3, @types/node 24.19.2
**Cost noted:** first-load JS 158.4 -> 175.2 KB gz (~8.5 KB React 19.3 measured, ~8.7 KB motion 14 by elimination)
**Next:** User checks the fade fix on the served build, then commit/push/PR. Remaining: remark-mdx-frontmatter 6, web-vitals/rehype-highlight/remark-gfm removal (unused), TS 7 later

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
| 2026-10-22 | llms.txt/index.md as TanStack server routes | Built from data modules so they stay in sync; sitemap .mjs script stays plain JS (no TS imports) |
| 2026-10-22 | Hero/llms copy lives in `src/data/profile.ts` | Single source for page and markdown versions |
| 2026-10-22 | TanStack + Vite upgrade follows TanStack's `examples/react/start-basic` at 1.169.3 | Start 1.169 requires Vite 8; Start pins an exact react-router version, so all TanStack packages move together. Official example is the reference config (nitro beta, plugin-react 6, `resolve.tsconfigPaths`) |
| 2026-10-22 | GitHub/LinkedIn icons as local components copied from lucide 0.544 | lucide-react 1.0 removed brand icons; copying the ISC-licensed outline paths keeps the exact look and stroke style of the other icons |
| 2026-10-22 | Only install versions >= 1 day old (motion 14.5.0, not 14.6.0) | Repo intent in `.npmrc` (`minimumReleaseAge: 1d`), which pnpm currently ignores |
| 2026-10-22 | CI on Node 24 | Start needs Node >=22.12, Vitest 5 needs >=22.12; matches Dockerfile |
| 2026-10-23 | Page fade keyed on leaf match id (`s.matches.at(-1)?.id`), not `location.pathname` | `location` updates on click but the old page stays rendered until an unvisited route's chunk loads, so the old page re-faded and the new one popped in. Match ids change in the same render as the page; leaf `pathname` collides for unknown URLs (root-only match = `/`) |

---
_Updated: 2026-10-23
