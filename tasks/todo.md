# TODO

> Current tasks. Agent marks [x] as done. Plan -> Build -> Review is the master workflow.

## ACTIVE

Branch: `fix/navbar-blur-delay-dissapear` — mobile navbar blur delay after navigation

- [x] 1. Reproduce in mobile Chromium: `site-header` snapshot captured the bar mid-close and stayed for 400ms
- [x] 2. Root cause: router captures after loaders (~150ms), Motion exit is 200ms, so the tall bar is frozen in the named snapshot
- [x] 3. Close the menu synchronously on nav-link clicks (unmount AnimatePresence before capture); keep X-button exit animation
- [x] 4. Verify: tsc, 40 tests, prod build, Chromium + Firefox mobile, desktop nav + project morph under the bar
- [ ] 5. User review on Tailscale port 3000, then commit

## ACTIVE

Branch: `feat/bangkit-digit-demo` — Bangkit case-study in-browser digit demo

- [x] 1. Pin `model.h5` to AritmaPlay/aritmaplay-ml-api blob `417f9d3…` (sha256 `0d7f329…`) and export 20,954 float32 weights (83,816 B)
- [x] 2. Generate Keras 3.5.0 parity fixtures from the same file (5 samples)
- [x] 3. Implement `src/lib/digitModel.ts` (conv/pool/dense/softmax) and `src/lib/digitInput.ts` (48x48 grayscale)
- [x] 4. Add unit + parity tests (8 new; all 32 pass)
- [x] 5. Build `DigitDemo`: pointer canvas, lazy 84 KB weights, 10 probability bars, clear, retry
- [x] 6. Wire into `projects.ts` (`demo: 'digit'`) and `projects_.$slug.tsx`
- [x] 7. Verify tsc, tests, build, production asset (200 / 83,816 B), Chromium desktop + mobile (1 and 7), no console errors
- [ ] 8. User review, then commit/PR (not committed)
- [ ] 9. Confirm team permission to redistribute the model weights (AritmaPlay repos have no LICENSE)

## DONE — hero grid (merged PR #5)

Branch: `feat/add-hero-bg-effect` — hover highlight on the hero grid backdrop

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
