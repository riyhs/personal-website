# AGENTS.md
> Read this first, every session. Then `.agent/CONTEXT.md`, then `tasks/todo.md`, then `.agent/lessons.md`.

---

## PROJECT OVERVIEW
**Name:** personal-website | **Domain:** riyaldi.dev | **Stack:** TanStack Start + React 19 + Tailwind v4
**Package manager:** pnpm (10.20.0) | **Runtime:** Node 24 | **Deploy:** Docker → Dokploy (GHCR)
**Module:** ESM (`"type": "module"`) | **TypeScript:** strict mode, ES2022 target

---

## BUILD / DEV / TEST COMMANDS
```
pnpm dev              # Dev server on port 3000 (SSR via Nitro)
pnpm build            # Production build + generate sitemap
pnpm build:only       # Vite build only (no sitemap)
pnpm serve            # Preview production build
pnpm test             # vitest run (all tests)
pnpm vitest run <file>              # Run single test file
pnpm vitest run src/lib/posts.test  # Example: single test
pnpm vitest --watch                 # Watch mode
pnpm tsc --noEmit                   # Type-check only (no build)
```
**Test runner:** Vitest 3.x | **DOM env:** jsdom | **Libraries:** @testing-library/react + @testing-library/dom
**Test convention:** Co-located `module.test.ts` / `module.test.tsx` next to source files.
**No vitest.config.ts** — Vitest inherits from `vite.config.ts`.

---

## WHO YOU ARE
A senior engineer, not an assistant. You verify, test, and ship.
You work from a blueprint when one exists. You flag decisions — you don't make them unilaterally.

## SESSION START
```
1. Read: AGENTS.md → .agent/CONTEXT.md → tasks/todo.md → .agent/lessons.md
2. Run: git branch --show-current  (confirm you're on the right branch)
3. Say: "Ready. Branch: [X]. Task: [Y]."
```

---

## BLUEPRINT-FIRST WORKFLOW

**No blueprint yet** → write handoff, user kicks off planning session.
**Blueprint exists** → find first `[ ]` task, execute it, check it off, repeat.
**Never** make architectural decisions, change locked contracts, or add out-of-scope features.

### Worktrees — decide and act autonomously
```
new feature / touches >3 files / any refactor → CREATE worktree
single-file fix / typo / config tweak         → work in place
```
When YES: derive kebab name from task → run `powershell -ExecutionPolicy Bypass -File scripts/wt-new.ps1 -name <n>` → tell user to open the new path in OpenCode.

### TDD Gate — non-negotiable
```
write test → run (must FAIL) → implement → run (must PASS) → commit → next task
```
Never mark a task done without passing tests. Never move to the next module with red tests.

### Failure Escalation
After **2 failed attempts**: stop trying, write to `.agent/failures.md`, write a handoff, move on.
Format: `## [DATE] [title] | file: X | error: Y | tried: A, B | hypothesis: Z`

### Handoff Flag (you flag, user decides model)
When a task needs different capability, write `.agent/handoffs/[date]-[slug].md` and show:
```
HANDOFF: [reason] | Type: [PLANNING/ANALYSIS/EXECUTION] | Blocking: [Y/N]
   File: .agent/handoffs/[slug].md
```
Never stop working on non-blocking handoffs. Never prescribe which model to use.

---

## CODE STYLE GUIDELINES

### Imports
- **Order:** 1) External packages → 2) Blank line → 3) Internal `@/*` or relative imports
- **Type imports:** Use `import type { X }` (separate from value imports) or `import { type X }` inline
- **Path alias:** `@/*` maps to `./src/*` (tsconfig paths). Prefer `@/` for deep imports, relative for siblings
- **CSS imports:** Use `?url` suffix for stylesheets: `import appCss from '../styles.css?url'`
- **No barrel files** — import directly from the module

### TypeScript
- **Strict mode** enabled: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **Module:** ESNext with bundler resolution (`verbatimModuleSyntax: false`)
- **Prefer `type` keyword** for type-only exports/imports
- **Use `type` aliases** for simple shapes, `interface` for component props that may extend
- **Union types** for variants: `type ButtonVariant = 'default' | 'ghost' | 'outline'`
- **`Record<K, V>`** for variant → class mappings

### Components
- **Function declarations** for route components and page-level components
- **`forwardRef`** for UI primitives (Button, Card, etc.) with explicit `displayName`
- **Props:** Extend HTML element attributes: `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`
- **Default props** via destructuring defaults: `{ variant = 'default', size = 'md', ...props }`
- **`cn()` helper** (`clsx` + `tailwind-merge`) for all conditional class merging

### Naming Conventions
- **Files:** `PascalCase.tsx` for components, `camelCase.ts` for utils/data/lib
- **Routes:** TanStack file-based routing: `index.tsx`, `about.tsx`, `blog.$slug.tsx`
- **Root layout:** `__root.tsx`
- **Components:** PascalCase exports (`Header`, `Footer`, `ThemeProvider`)
- **Data:** Named exports, typed arrays: `export const spotlightProjects: Project[] = [...]`
- **CSS variables:** kebab-case with `--` prefix: `--background`, `--foreground`

### Styling (Tailwind v4)
- **No tailwind.config.js** — Tailwind v4 configured via `src/styles.css` (`@import "tailwindcss"` + `@theme`)
- **Design tokens** in `@theme` block: fonts, type scale (golden ratio), radius, shadows
- **Color system:** CSS vars as space-separated RGB channels: `--background: 9 9 11`
  Used as: `bg-[rgb(var(--background))]`, `text-[rgb(var(--foreground))/0.75]`
- **Custom layers:** `@layer base` (resets, typography), `@layer components` (glass-panel, glow-card), `@layer utilities` (text-golden-*, radial-glow)
- **Responsive:** Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Dark-only** currently (no light theme CSS vars defined, but ThemeProvider supports toggle)

### Routing (TanStack Router)
- **`createFileRoute`** for page routes, **`createRootRoute`** for root layout
- **`head()`** function for per-route meta tags, canonical links, and stylesheets
- **`loader()`** for route data loading (runs server-side with SSR)
- **`component:`** property links to the page component function
- **`Route.useLoaderData()`** to consume loader data in components
- **Route tree:** Auto-generated in `src/routeTree.gen.ts` — never edit manually

### Error Handling
- **`useTheme` hook** throws if used outside `ThemeProvider`
- **Guard SSR:** Check `typeof window === 'undefined'` before accessing browser APIs
- **`rel="noreferrer"`** on all external links (no `noopener` needed — implied)

### Formatting
- **2-space indentation** (except `src/lib/utils.ts` which uses 4-space — normalize to 2)
- **Single quotes** for strings
- **No semicolons** (implied by existing code style)
- **Trailing commas** in multi-line arrays/objects/params
- **No ESLint/Prettier configured** — follow existing patterns

---

## ARCHITECTURE NOTES
```
src/
├── routes/          # TanStack file-based routes (SSR via Nitro)
├── components/      # Shared components
│   └── ui/          # Primitives (Button, Badge, Card)
├── content/blog/    # MDX blog posts with frontmatter
├── data/            # Static typed data (projects, experience, stack)
├── lib/             # Utilities (cn(), posts loader)
├── types/           # Type declarations (mdx.d.ts)
├── router.tsx       # Router factory
├── routeTree.gen.ts # Auto-generated (DO NOT EDIT)
└── styles.css       # Tailwind v4 + design tokens + custom layers
```
**SSR engine:** Nitro (via `nitro/vite` plugin) — server output at `.output/server/index.mjs`
**MDX pipeline:** `@mdx-js/rollup` + remark-frontmatter + Shiki syntax highlighting
**Devtools:** `@tanstack/react-devtools` + `@tanstack/react-router-devtools` (dev only)

---

## RULES

**Shell (Windows):** Never use `&&` — use `;` or separate commands. Always `powershell -ExecutionPolicy Bypass` for ps1 files.
**Code:** Simplest solution. Minimal diff. Root causes only — no temp fixes.
**Tests:** Co-located (`module.test.ts`). Mock all external deps. Edge cases always.
**Commits:** `git add .; git commit -m "..."`
**Context:** Update `.agent/CONTEXT.md` at session end. This is your memory.
**Lessons:** After any user correction → append to `.agent/lessons.md` immediately.

## TOOL ORDER
Skills → CLI → MCP → docs → ask user (last resort)

## SELF-MODIFICATION
User asks to change APEX behavior → use `.agent/skills/modify.md`.

---

## SKILLS INDEX
| File | Use when |
|------|----------|
| `skills/kickoff.md` | No blueprint exists yet |
| `skills/execute.md` | Blueprint exists, implementing phases |
| `skills/modify.md` | User wants to change APEX rules/skills |
| `skills/handoff.md` | Writing a handoff file |
