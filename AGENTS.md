# AGENTS.md
> Read this first, every session. Then `.github/instructions/karpathy.instructions.md`, `.agents/CONTEXT.md`, `tasks/todo.md`, and `.agents/lessons.md`.

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
Use `.github/instructions/karpathy.instructions.md` as the main engineering personality: think before coding, prefer simplicity, make surgical changes, and verify goals.
You use Plan -> Build -> Review workflow by default. You keep subagent use to minimum. You flag decisions — you don't make them unilaterally.

## SESSION START
```
1. Read: AGENTS.md -> .github/instructions/karpathy.instructions.md -> .agents/CONTEXT.md -> tasks/todo.md -> .agents/lessons.md
2. Run: git branch --show-current  (confirm you're on the right branch)
3. Say: "Ready. Branch: [X]. Task: [Y]."
```

---

## PLAN BUILD REVIEW WORKFLOW

**Plan** -> clarify scope, inspect codebase, and create/update `tasks/todo.md` for multi-step work.
**Build** -> implement minimal correct changes, follow repo rules, and verify with focused tests/checks.
**Review** -> switch to `reviewer` primary agent for non-trivial code changes before marking work complete.
**Never** make architectural decisions, change locked contracts, or add out-of-scope features without user approval.

### Worktrees — decide and act autonomously
```
new feature / touches >3 files / any refactor → CREATE worktree
single-file fix / typo / config tweak         → work in place
```
When YES: derive kebab name from task → run `powershell -ExecutionPolicy Bypass -File scripts/wt-new.ps1 -name <n>` → tell user to open the new path in OpenCode.

### Quality Gate
```
plan -> build -> verify -> review -> fix findings -> complete
```
For behavior changes, prefer test-first when practical. Never mark a task done with failing required checks.

### Failure Escalation
After **2 failed attempts**: stop trying, write to `.agents/failures.md`, summarize attempts, and ask user for direction.
Format: `## [DATE] [title] | file: X | error: Y | tried: A, B | hypothesis: Z`

### Review Agent
Use `reviewer` primary agent after meaningful code changes. Reviewer is read-only and checks repo rules, security, tests, design consistency, accessibility, and maintainability.

### Subagents
Use subagents only when main agents are poor fit or when narrow read-only search is enough. Prefer `plan`, `build`, and `reviewer` first.

---

## CODE STYLE GUIDELINES

### Imports
- **Order:** 1) External packages → 2) Blank line → 3) Internal `@/*` or relative imports
- **Type imports:** Use `import type { X }` (separate from value imports) or `import { type X }` inline
- **Path alias:** `@/*` maps to `./src/*` (tsconfig paths). Prefer `@/` for deep imports, relative for siblings
- **CSS imports:** Use side-effect imports for route stylesheets: `import '../styles.css'`. Never use `?url` CSS imports in TanStack Start SSR routes.
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
**Context:** Update `.agents/CONTEXT.md` at session end. This is project memory.
**Preferences:** Store user workflow/style preferences in `.agents/PREFERENCES.md`.
**Lessons:** After any user correction -> append to `.agents/lessons.md` immediately.

## TOOL ORDER
Skills → CLI → MCP → docs → ask user (last resort)

## SELF-MODIFICATION
User asks to change agent behavior, workflow, skills, or preferences -> update `AGENTS.md`, `WORKFLOW.md`, `.agents/PREFERENCES.md`, or `.opencode/` files as appropriate.

---

## SKILLS INDEX
| File | Use when |
|------|----------|
| `code-review` | Review security, correctness, performance, maintainability |
| `web-design-guidelines` | Review UI, accessibility, and design consistency |
| `memory-management` | Maintain local markdown memory and project context |
| `task-management` | Maintain local markdown task lists |
| `.opencode/agent/reviewer.md` | Read-only quality review primary agent |
