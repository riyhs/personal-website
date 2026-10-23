# TODO

> Current tasks. Agent marks [x] as done. Plan -> Build -> Review is the master workflow.

## ACTIVE

Branch: `chore/upgrade-tanstack-start` — upgrade to latest TanStack Start (uncommitted, for user review)

- [x] 1. Baseline: build time, bundle sizes, route statuses, SSR HTML -> saved for comparison
- [x] 2. Upgrade TanStack packages together + Vite 8 + plugin-react 6 + Vitest 5 + nitro beta, per TanStack start-basic example
- [x] 3. Replace vite-tsconfig-paths with Vite `resolve.tsconfigPaths`
- [x] 4. CI Node 20 -> 24
- [x] 5. Gate: tsc, tests, prod build, Firefox + Chromium e2e, dev server, clean-container CI build, Docker image
- [x] 6. Batch 2: React 19.3, shiki 4, lucide 1.x (+ local brand icons), framer-motion -> motion, TS 6, jsdom 30, @types/node 24
- [x] 7. Gate batch 2: tsc, tests, build, icon/code-block HTML diff, Firefox + Chromium e2e, Docker

## DONE

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
