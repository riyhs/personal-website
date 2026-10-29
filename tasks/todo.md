# TODO

> Current tasks. Agent marks [x] as done. Plan -> Build -> Review is the master workflow.

## ACTIVE

Branch: `wt/mobile-grid-and-perf` (worktree `../personal-website-wt-mobile-grid-and-perf`) — items picked from the 2026-10-29 audit (Obsidian: `Hermes/Personal Website - Audit 2026-10-29.md`). Uncommitted, for user review.

- [x] Touch on the hero grid: tap pulses, sideways drag sweeps, vertical swipe still scrolls (`touch-pan-y touch-pinch-zoom`, pointercancel hides)
- [x] View transitions: `defaultViewTransition`, thumbnail -> case-study hero morph via shared `view-transition-name`; keyed `animate-page-in` removed; disabled under reduced motion
- [x] `LazyMotion` + `m` in Header, features in `src/lib/motionFeatures.ts` (own chunk)
- [x] `defaultPreload: 'intent'`
- [x] Fonts: only Jakarta 400 + 600
- [x] Removed github/linkedin preconnects
- [x] Post lists load frontmatter only (`?frontmatter` Vite plugin + `yaml` devDep); bodies are per-post chunks loaded by the post loader, `React.lazy` fallback during hydration
- [x] Verify: tsc, 28 tests, prod build (entry 145.6 -> 113.5 KB gz, motion features 17.8 KB gz lazy), 31 Chromium checks (desktop, touch emulation, delayed-chunk hydration, morph pairing forward + back, dev-mode HMR)
- [x] User review on Tailscale preview, then commit
- [x] Navbar blur during view transitions fixed: name the bar div (backdrop-filter copied to the group); user-verified in Firefox + Chrome
- [x] Real phone: user-tested touch grid + morph, works
- [x] Home touch intro: centre press + 4-ring ripple at 400ms, once per session, touch-only, reduced-motion skipped
- [x] Morph back to 400ms (blur fixed); theme swap 250 -> 500ms
- [x] AGENTS.md: after 2 failed attempts, research official docs/specs/bug trackers before attempt 3
- [x] Preload Jakarta 400/600 (`?url` imports in __root.tsx share the CSS hashed files; one fetch each, starts with the CSS)

Previous branch: `feat/add-hero-bg-effect` — hover highlight on the hero grid backdrop (merged, PR #5)

Goal: hovering a 48px cell of the hero grid tints **only that cell** green. Every cell you cross keeps fading on its own, so a sweep leaves a trail. The green must inherit the existing bottom-fade mask (`.grid-backdrop`), so lower rows stay dimmer. Must not cost bundle size or main-thread frames.

- [x] 1. Baseline screenshot of the hero (dark + light, desktop + mobile)
- [x] 2. Extract `GridBackdrop` component + pure `cellFromPoint` / `cellPosition` helpers in `src/lib/grid.ts`
- [x] 3. Implement: 32-cell ring buffer, CSS-only opacity transitions, pointermove bails unless the cell index changes
- [x] 4. Add `--grid-hover` token for dark + light themes
- [x] 5. Unit test `cellFromPoint` / `cellPosition` round trip
- [x] 6. Verify: tsc, tests, prod build, before/after screenshots, Firefox + Chromium hover, bundle size delta
- [x] 7. Serve over Tailscale for user review
- [x] 8. Round 2 (user feedback: trail capped at 2 cells, fade too quick) -> 32-cell ring buffer, exit 250ms + **linear** fade, entry 90ms
- [x] 9. Round 3: fade duration 1500ms -> 1250ms (user-tuned)
- [x] 10. Animation audit (improve-animations, HEAD 5502ca0) — 5 findings fixed:
  - button: stacked `transition-*` utilities cancelled colour + shadow transitions
  - `--default-transition-timing-function: var(--ease-out)` so all 12 `transition-colors` sites use the repo curve
  - theme swap made instant (animating every element measured ~30fps; fading body alone left a mismatch)
  - dropped `will-change: opacity` from the 32 trail layers
  - trail disabled under `prefers-reduced-motion: reduce` (instant on/off, one cell lit)
- [x] 12. Smooth theme swap (user request, like fenilromoliya.com): 250ms colour blend on backdrop + header + footer + rules + text
  - backdrop moved to `body::before` (canvas-propagated backgrounds can't transition)
  - removed the opaque `bg-[rgb(var(--background))]` from the root layout wrapper that hid the layer
  - colour transitions scoped to elements that set their own colour (inheriting children caused a retarget storm)
  - verified: 206 transitions / 0 cancels / median 180ms / p50-p95 17ms in Chromium + Firefox
- [x] 13. Hero grid gravity-well bend (user request): grid lines pull toward the cursor, green tint still follows and rides the bend
  - canvas draws grid + tint in one pass; cell tint is the quad between its four bent corners (a transform cannot match a quad)
  - Gaussian pull `e^-(r/R)^2`, R=150, strength 0.4; flat again three radii out
  - loop stops at rest (0 rAF/s), one path + one stroke, two-point segments outside the bend radius
  - verified: 8/8 canvas checks, 24/24 unit tests, p95 ~20ms during a sweep, reduced motion flat with no trail, no console errors
- [ ] 11. Audit follow-ups left for user decision: 600ms page entrance on every nav; DESIGN.md claims a mobile-menu link stagger that doesn't exist; menu animates `height` (layout)

Outcome: 32 tint layers of 48x48 moved with `transform` inside `.grid-backdrop`, so they inherit the bottom-fade mask (green delta 29 on the top row -> 3 on the bottom row). Trail of 13 cells after a 13-cell sweep, 27 after a full-width sweep, capped at the 32-cell pool. Cost ~+600 B gz total. Cell-change handler 22.5us (no layout read per move). Frame gaps p50 16.7ms / p95 16.8ms, no long tasks.

## DONE

- [x] Upgrade TanStack Start to 1.169.3 + Vite 8 + React 19.3 + Motion 14 + TS 6 — merged PR #4
- [x] Fix page fade replaying the old page on first visits (key on leaf match id) — `da94a01`
- [x] Show project screenshot under the title on project pages — `a110556`

- [x] Personal refresh (safzan/dharma inspiration): theme toggle, colophon, llms.txt/index.md, home redesign, case studies — merged PR #3
- [x] Fix TanStack Router dev code-splitter duplicate `hot` declaration on blog detail route
- [x] Read legacy workflow files, understand codebase
- [x] Update AGENTS.md with code style guidelines
- [x] Write old project roadmap
- [x] PHASE 0: Upgrade @tanstack/\* packages from 1.139.3 → 1.167.14
- [x] PHASE 1: Fix FOUC with ScriptOnce
- [x] PHASE 2: SEO optimization (per-route meta, JSON-LD, og:url, absolute OG images)
- [x] PHASE FINAL: Build verification + CONTEXT.md update
- [x] Replace legacy workflow with Plan -> Build -> Review workflow
- [x] Workflow migration verified by read-only review
- [x] Remove duplicate `routerPlugin()` from vite.config.ts — fix `const hot` declaration error
- [x] Add `notFoundComponent` to root route + create NotFound component
- [x] Full Web Interface Guidelines audit — 24 findings fixed across 4 tiers
- [x] Fix `overscroll-behavior-contain` → `overscroll-contain` in ImageModal
- [x] Update AGENTS.md with new rules (button nesting, opacity tokens, MotionConfig, devtools guard)
- [x] Remove backdrop blur in Firefox (widen `@supports (-moz-appearance:none)` fallback in styles.css to all form factors + all blurred surfaces)
- [x] Replace Firefox blur removal with fetchz-style tuning (12px radii, kill switch deleted)
