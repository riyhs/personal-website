# BLUEPRINT
> TOP model writes once. All models execute from this. Never modify without user instruction.

## PROJECT
**Name:** personal-website | **Type:** web | **Stack:** TanStack Start + React 19 + Tailwind v4
**Goal:** Upgrade TanStack Start to latest, fix FOUC, and optimize SEO for first-page Google indexing on riyaldi.dev

## ARCHITECTURE
```
src/
├── routes/__root.tsx       ← SSR shell, head management, ThemeProvider, FOUC fix
├── routes/index.tsx        ← Home page with SEO meta + JSON-LD
├── routes/about.tsx        ← About page with per-route SEO
├── routes/blog.tsx         ← Blog listing with per-route SEO
├── routes/blog.$slug.tsx   ← Blog detail with dynamic SEO
├── routes/projects.tsx     ← Projects page with per-route SEO
├── components/ThemeProvider.tsx ← Theme + ScriptOnce for FOUC
├── styles.css              ← Tailwind v4 design tokens
└── router.tsx              ← Router factory
```
**Patterns (locked — never deviate):**
- Errors: throw in hooks (useTheme), guard SSR with typeof window
- Async: loader() for route data
- Config: Tailwind v4 via styles.css @theme block, no tailwind.config
- Tests: Vitest, co-located, no real I/O in unit tests

## ROADMAP
Phases run top-to-bottom. Gate must pass before next phase starts.

### PHASE 0 — TanStack Upgrade
**Worktree:** `wt/upgrade-seo-fouc` | **Gate:** `pnpm build` clean, dev server starts, all routes render
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 0.1 | Update @tanstack/react-start, @tanstack/react-router, @tanstack/router-plugin, @tanstack/react-router-devtools, @tanstack/react-devtools, @tanstack/devtools-vite, @tanstack/react-router-ssr-query to latest | `package.json` | [ ] |
| 0.2 | Run pnpm install, resolve any peer dep conflicts | `pnpm-lock.yaml` | [ ] |
| 0.3 | Check for breaking API changes in vite.config.ts imports | `vite.config.ts` | [ ] |
| 0.4 | Check for breaking API changes in routes (head(), loader(), etc.) | `src/routes/*.tsx` | [ ] |
| 0.5 | Verify routeTree.gen.ts regenerates correctly | `src/routeTree.gen.ts` | [ ] |
| 0.6 | Run `pnpm build` — must succeed | - | [ ] |
| 0.7 | Smoke test: `pnpm dev` — all 5 routes render | - | [ ] |

### PHASE 1 — Fix FOUC (Flash of Unstyled Content)
**Worktree:** same | **Gate:** No visible FOUC on page load
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1.1 | Add ScriptOnce for theme detection before hydration | `src/routes/__root.tsx` | [x] |
| 1.2 | Add suppressHydrationWarning to `<html>` tag | `src/routes/__root.tsx` | [x] |
| 1.3 | Ensure CSS is loaded via head links (already done via ?url import) | `src/routes/__root.tsx` | [x] |
| 1.4 | Update ThemeProvider to work with ScriptOnce (read class from DOM) | `src/components/ThemeProvider.tsx` | [x] |

### PHASE 2 — SEO Optimization
**Worktree:** same | **Gate:** HTML source shows correct meta, JSON-LD, canonical on all routes
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 2.1 | Add per-route title overrides (not just root "Personal Website - Riyaldi") | `src/routes/index.tsx`, `about.tsx`, `blog.tsx`, `projects.tsx` | [ ] |
| 2.2 | Add per-route og:title, og:description, og:url meta tags | `src/routes/*.tsx` | [ ] |
| 2.3 | Fix OG image to use absolute URL (https://riyaldi.dev/img/website.webp) | `src/routes/__root.tsx` | [ ] |
| 2.4 | Add og:url meta tag to root and per-route | `src/routes/__root.tsx`, `src/routes/*.tsx` | [ ] |
| 2.5 | Add JSON-LD structured data (Person + WebSite) to home page | `src/routes/index.tsx` | [ ] |
| 2.6 | Add JSON-LD Article structured data to blog posts | `src/routes/blog.$slug.tsx` | [ ] |
| 2.7 | Add dynamic meta tags for blog posts (title, description from frontmatter) | `src/routes/blog.$slug.tsx` | [ ] |
| 2.8 | Fix manifest.json — update name from "TanStack App" to proper values | `public/manifest.json` | [ ] |
| 2.9 | Update sitemap.xml generation to include lastmod, changefreq, priority | `scripts/generate-sitemap.mjs` | [ ] |
| 2.10 | Verify robots.txt is correct | `public/robots.txt` | [ ] |

### PHASE FINAL — Verification
**Worktree:** same | **Gate:** build clean + all routes verified
| # | Task | File(s) | Status |
|---|------|---------|--------|
| F.1 | Run `pnpm build` — must succeed | - | [ ] |
| F.2 | Run `pnpm tsc --noEmit` — no type errors | - | [ ] |
| F.3 | Verify SSR HTML output for home page meta tags | - | [ ] |
| F.4 | Update .agent/CONTEXT.md | `.agent/CONTEXT.md` | [ ] |

## CONSTRAINTS
- Only upgrade @tanstack/* packages in this pass — leave vite 8, shiki 4, typescript 6 for a future upgrade
- Do not change the visual design or layout
- Do not add new routes
- Do not change the build/deploy pipeline
- OG images must use absolute URLs with https://riyaldi.dev prefix

## DECISIONS
| Date | Decision | Why |
|------|----------|-----|
| 2026-03-31 | TanStack-only upgrade | Minimize risk — vite 7→8, shiki 3→4, TS 5→6 are major bumps best done separately |
| 2026-03-31 | Use ScriptOnce for FOUC | Official TanStack approach per docs |
| 2026-03-31 | JSON-LD for SEO | Google recommends structured data for rich results |

## HANDOFF CONDITIONS
Flag `[NEEDS-HANDOFF]` and write to `.agent/handoffs/` when:
- New feature not in this roadmap
- Contract signature must change
- Phase gate fails and unfixable in 2 attempts
