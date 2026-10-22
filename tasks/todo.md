# TODO

> Current tasks. Agent marks [x] as done. Plan -> Build -> Review is the master workflow.

## ACTIVE

Branch: `feat/personal-refresh` — inspiration pass from safzan.dev + dharma-yudistira.com

- [x] 1. Theme: fix broken `rgb(var(--x))/N]` opacity classes, tokenize `white/N` theme surfaces, header light/dark toggle -> verify: compiled CSS has no `))/.`, screenshots both themes
- [x] 2. Colophon footer: build SHA + date via Vite `define` (GIT_SHA env -> git fallback), Dockerfile ARG -> verify: footer renders, hides SHA when absent
- [x] 3. `/llms.txt` + `/index.md` server routes from data modules -> verify: curl body + content-type
- [x] 4. Home: specific hero, grouped stack table, dated writing list, project rows, mono labels, dashed dividers, faint grid -> verify: screenshots desktop/mobile
- [x] 5. `/projects/$slug` case-study pages + sitemap entries -> verify: unknown slug -> 404
- [x] 6. Gate: pnpm test, tsc, build, screenshots all routes x theme x viewport; review

## DONE

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
