# TODO

> Current tasks. Agent marks [x] as done. Plan -> Build -> Review is the master workflow.

## ACTIVE

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
