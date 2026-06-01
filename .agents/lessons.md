# Lessons

- Read repo-level `AGENTS.md` first, then `.agents/CONTEXT.md`, `tasks/todo.md`, and `.agents/lessons.md`.
- This repo uses `.agents/` for local memory and project skills.
- User wants Plan -> Build -> Review workflow instead of the legacy roadmap/escalation system.
- User says current code implementation is correct; update docs to match current codebase, not old assumptions.
- User wants Karpathy instructions as main agent personality.

## 2026-03-31 CSS 404 in Docker prod builds -> Never use `?url` CSS imports with TanStack Start SSR

### Problem
`import appCss from '../styles.css?url'` in `src/routes/__root.tsx` resolved to different content hashes in client vs SSR Vite environments during Docker Alpine Linux builds. SSR-rendered HTML referenced CSS that was not deployed, causing browser 404 and no styles.

### Root Cause
Vite 7 Environments API processes CSS independently per environment. `@tailwindcss/vite` scans each environment's module graph for utility classes. SSR can see more modules than client, producing different CSS content and hashes. Nitro asset copy does not deploy `?url` CSS from SSR output.

### Fix
Use regular side-effect CSS imports, for example `import '../styles.css'`, and let TanStack Start manifest inject the client bundle CSS link.

### Rule
Never use `?url` CSS imports in TanStack Start SSR routes. Use side-effect imports and framework manifest injection.
