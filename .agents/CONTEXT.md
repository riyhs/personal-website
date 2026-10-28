# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** Upgrade branch merged to `main` via PR #4 (`a81c881`). Tree clean. Working on the hero grid hover effect on `feat/add-hero-bg-effect`.
**Branch:** feat/add-hero-bg-effect | **Worktree:** personal-website
**Last completed:** TanStack Start 1.169.3 / Router 1.170.45 / Vite 8.3.5 / Vitest 5.0.5 / React 19.3.1 / Motion 14.5.0 / TypeScript 6.0.3 upgrade (PR #4), plus project-page screenshot under the title (`a110556`) and the page-fade keyed on leaf match id (`da94a01`)
**Verified:** tsc, 14 unit tests, prod build, first-load JS 175.2 KB gz, Firefox + Chromium hover suite (14 checks), frame gaps p50 16.7ms / p95 16.8ms with no long tasks during a full trail, Docker image 427.5 MB
**In progress:** None — animation audit fixes applied on top of the hero trail (uncommitted, for user review)
**Next:** User reviews the motion changes on the Tailscale preview, then commit. Audit follow-ups deliberately NOT done: 600ms page entrance (DESIGN.md marks it deliberate) and the mobile-menu link stagger that DESIGN.md documents but the code never had. Remaining backlog: remark-mdx-frontmatter 6, web-vitals/rehype-highlight/remark-gfm removal (unused), TS 7 later, untrack `package-lock.json` (npm leftover from `.cta.json`, repo uses pnpm)

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
| 2026-10-28 | Grid hover tint = a 32-element ring buffer, not 2 spans and not one div per cell | 2 spans capped the visible trail at 2 cells (user complaint). One div per cell is 300+ nodes and ~10 KB of SSR HTML. 32 covers any trail that fits on screen (~27 columns at 1280px); past that the ring overwrites the dimmest end |
| 2026-10-28 | Cell tint is a 48x48 element moved with `transform` (replaced the `background-position` tile trick) | The tile trick needs `inset: 0` layers, so 32 of them meant 32 viewport-sized layers to composite. Sized + transformed elements make each fade a compositor-only opacity change on a tiny layer. Positions come from the cached backdrop rect; `cellPosition`/`cellFromPoint` round-trip is unit-tested |
| 2026-10-28 | Fade is `linear` at 1250ms, not `--ease-out` | ease-out is ~85% done at 20% of the duration, so a 1s fade read as a 300ms flick. Linear keeps the trail evenly weighted for the whole duration. User tuned the duration 1000 -> 1500 -> 1250ms |
| 2026-10-28 | Entry ramp 90ms, exit 250ms delay + 1250ms fade | A fast flick crosses a 48px cell in 16-50ms; with a 180ms entry every cell was abandoned at 0.37 opacity and the trail looked washed out. 90ms gets cells to 0.9-0.98 |
| 2026-10-28 | Cache the backdrop rect in a ref instead of calling `getBoundingClientRect()` per pointermove | The handler writes classes and custom properties, so the next read forced a synchronous layout: 428us per cell change. Caching drops it to 22.5us (same as a no-op move) |
| 2026-10-28 | Button transition: one `transition` utility, not three stacked `transition-*` | Each `transition-*` sets `transition-property` and the last wins; computed style proved colours and shadow had none and snapped on hover |
| 2026-10-28 | `--default-transition-timing-function: var(--ease-out)` in `@theme` | The repo curve existed but no utility consumed it; all 12 `transition-colors` sites used Tailwind's default `cubic-bezier(0.4, 0, 0.2, 1)` |
| 2026-10-28 | Theme swap is instant, no colour transition at all | Fading only `body` left surfaces/text snapping mid-swap; transitioning colour on every element measured ~30fps (25 vs 53 frames). One-frame switch is coherent and free |
| 2026-10-28 | Hero grid bends around the cursor (canvas), trail drawn as a warped quad | The tint must share the grid's coordinate space or it drifts off the bend. Rendering both on one canvas was cheaper than warping 32 DOM layers, and lets the cell be the quad between its four bent corners |
| 2026-10-28 | Bend is a Gaussian pull (`e^-(r/R)^2`), not `1/r²` | A 1/r² pull decays as 1/r once multiplied by distance, so the whole viewport slid toward the cursor. Gaussian is flat by three radii out |
| 2026-10-28 | Theme swap blends 250ms via a fixed `body::before` backdrop | Canvas-propagated backgrounds never transition, so the solid backdrop lives on a viewport-sized fixed layer. `--glow-soft` had to be dropped from `body`: the layout wrapper used to cover it, so removing that opaque background exposed it and the dark page turned grey. Animating the full-height wrapper instead cost p95 33ms |
| 2026-10-28 | Colour transitions only on elements that set their own colour | Children that merely inherit end up retargeting the animated parent every frame: 0 cancels after narrowing the list vs hundreds before, and the fade stopped overshooting (last end 271ms vs 795ms) |
| 2026-10-28 | Dropped `will-change: opacity` from the trail cells | 32 permanently promoted layers for a fade that only runs on hover. Measured neutral (p95 16.8ms either way), so the smaller cost wins |

---
_Updated: 2026-10-28
