# LESSONS
> Append after any user correction: `## [DATE] [what went wrong] → [rule]`

## 2026-03-31 CSS 404 in Docker prod builds → Never use `?url` CSS imports with TanStack Start SSR

### Problem
`import appCss from '../styles.css?url'` in `src/routes/__root.tsx` resolved to **different content hashes** in client vs SSR Vite environments during Docker (Alpine Linux) builds. The client build produced `styles-v0MGWZDj.css` (53.60 kB) deployed to `.output/public/assets/`, but the SSR build produced `styles-QuHx-fZm.css` (62.36 kB) which went to `node_modules/.nitro/` and was never deployed. The SSR-rendered HTML referenced the SSR hash → browser got a 404 → no styles loaded.

### Root Cause
Vite 7 Environments API processes CSS independently per environment. `@tailwindcss/vite` scans each environment's module graph for utility classes — the SSR environment sees MORE modules (121 vs 67, no code-splitting) so Tailwind discovers more utility classes, producing different CSS content and thus different content hashes. On Windows the hashes happened to match (same CSS content), but on Docker Alpine Linux they diverged.

Nitro's `@pi0/vite-plugin-fullstack` sets `build.emitAssets: true` on the SSR environment, but its asset copy mechanism (`writeAssetsManifest`) only applies to `?assets` / `import.meta.vite.assets()` — NOT to `?url` imports.

### Fix (2 lines in `src/routes/__root.tsx`)
1. `import appCss from '../styles.css?url'` → `import '../styles.css'` (side-effect import)
2. Removed the manual `head()` `links` entry that referenced `appCss` (set `links: []`)

With a regular side-effect import, the CSS becomes part of the client bundle's `viteMetadata.importedCss`. TanStack Start's manifest system then auto-generates the `<link>` tag from the **client** bundle — always referencing the correct file that actually exists in `.output/public/assets/`.

### Rule
**Never use `?url` CSS imports in TanStack Start SSR routes.** Use regular `import './styles.css'` side-effect imports and let the framework's manifest handle `<link>` tag injection. The `?url` pattern is only safe for single-environment Vite builds (pure SPA).
