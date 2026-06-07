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

## 2026-06-07 Duplicate `const hot` declaration -> Never install routerPlugin() alongside tanstackStart()

### Problem
`[plugin:tanstack-router:code-splitter:compile-reference-file] Duplicate declaration "hot"` in dev mode on route files. The error persisted despite setting `codeSplittingOptions: { addHmr: false }`.

### Root Cause
TanStack Start internally installs router-plugin code-splitters via `tanStackStartRouter()` in `start-plugin-core`. These create separate code-splitter instances for client (`addHmr: true`) and server (`addHmr: false`) environments. The user's top-level `routerPlugin()` in `vite.config.ts` created a second HMR injector that also adds `const hot = import.meta.hot`. Both inject into the same route files, causing duplicate declarations.

### Fix
Remove the top-level `routerPlugin()` from `vite.config.ts`. TanStack Start's `tanstackStart()` plugin manages its own router plugins internally.

### Rule
Never install `routerPlugin()` separately alongside `tanstackStart()`. TanStack Start handles router code-splitting, generation, and HMR via its own internal plugin instances.

## 2026-06-07 notFoundError warnings -> Always configure notFoundComponent on root route

### Problem
`Warning: A notFoundError was encountered on the route with ID "__root__", but a notFoundComponent option was not configured, nor was a router level defaultNotFoundComponent configured.` appears multiple times during dev when any unmatched path is requested.

### Root Cause
TanStack Router v1 warns when a `notFoundError` is thrown but no route in the tree has a `notFoundComponent` configured. The router checks up the tree to the root route (`__root__`) looking for one and warns if none is found.

### Fix
Add `notFoundComponent` to `createRootRoute()` in `src/routes/__root.tsx`. Create a `NotFound` component matching the site's design (motion transitions, golden headings, "Back to Home" link).

### Rule
Always configure `notFoundComponent` on the root route in TanStack Router projects to suppress warnings and provide a styled 404 experience.

## 2026-06-07 Nested <button> inside <a> -> Never wrap Button inside Link

### Problem
`<Link to="/"><Button>...</Button></Link>` renders `<a><button>...</button></a>` which is invalid HTML — interactive elements must not be nested.

### Fix
Extract `getButtonClasses()` from `Button` component, then style `<Link>` or `<a>` directly with `cn(getButtonClasses(), className)`. Same visual result, valid HTML.

### Rule
Never nest `<Button>` inside `<Link>` or `<a>`. Either style the `<Link>`/`<a>` directly as a button, or use `<button>` with `router.navigate()`.

## 2026-06-07 Framer Motion reduced motion -> Use MotionConfig at root level

### Problem
9+ `motion.div` instances across pages had no `prefers-reduced-motion` guard. Each would need `useReducedMotion()` hook individually.

### Fix
Wrap app children in `<MotionConfig reducedMotion="user">` in `RootDocument`. Framer Motion blocks transform animations (x, y, scale, rotate) but preserves opacity animations. Single config, all children.

### Rule
Always add `<MotionConfig reducedMotion="user">` at the document root in Framer Motion projects. Never add per-component reduced-motion guards — use the global config.

## 2026-06-07 TanStack Devtools in production -> Guard with import.meta.env.DEV

### Problem
`<TanStackDevtools>` (general devtools wrapper) doesn't auto-strip in production. `<TanStackRouterDevtools>` does. Without guard, devtools bundle ships to prod.

### Fix
Wrap `<TanStackDevtools>` in `{import.meta.env.DEV && (...)}` condition in `__root.tsx`.

### Rule
Always guard `<TanStackDevtools>` with `import.meta.env.DEV`. `<TanStackRouterDevtools>` auto-strips — no guard needed for it.

## 2026-06-07 CSS variable opacity tokens -> Always use `text-[rgb(var(--foreground))/N]` not `text-white/N`

### Problem
Hardcoded `text-white/70` breaks in light mode — white text on white background. CSS-variable-based `text-[rgb(var(--foreground))/0.7]` adapts to theme.

### Fix
Replace all `text-white/N` with `text-[rgb(var(--foreground))/N]` across pages. Standardize section labels to 0.5, body text to 0.75.

### Rule
Never use `text-white/N` for theme-aware text. Use `text-[rgb(var(--foreground))/N]`. Reserve `text-white` only for dark-mode-only contexts like gradient hero text.

## 2026-06-07 TanStack Devtools packages -> Do not remove devtools packages without preserving dev UX

### Problem
Removing `@tanstack/react-devtools` while fixing production build breakage removed the general TanStack Devtools shell the user still expects in development.

### Fix
Keep `@tanstack/react-devtools` for the development UI. Avoid `@tanstack/devtools-vite` unless its production stripping behavior is explicitly wanted and verified, because that transform can conflict with TanStack Router code splitting.

### Rule
When fixing production devtools build issues, preserve development devtools UX. Prefer a dev-only component guarded by `import.meta.env.DEV` over deleting devtools packages broadly.
