# Personal Website — riyaldi.dev

A modern personal portfolio website built with TanStack Start, React 19, and Tailwind CSS v4.

## Tech Stack

- **Framework:** TanStack Start (SSR via Nitro)
- **Routing:** TanStack Router (file-based)
- **UI:** React 19 + Framer Motion
- **Styling:** Tailwind CSS v4 (CSS-first config via `@theme`)
- **Content:** MDX blog posts with Shiki syntax highlighting
- **Icons:** Lucide React
- **Package Manager:** pnpm 10.20.0
- **Runtime:** Node 24
- **TypeScript:** Strict mode, ES2022 target
- **Testing:** Vitest + Testing Library + Playwright
- **Deploy:** Docker → Dokploy (GHCR)

## Project Structure

```
src/
├── routes/              # TanStack file-based routes
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Home page
│   ├── about.tsx        # About page
│   ├── blog.tsx         # Blog index
│   ├── blog.$slug.tsx   # Blog post
│   └── projects.tsx     # Projects page
├── components/          # Shared components
│   ├── ui/              # Primitives (Button, Badge, Card)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ImageModal.tsx
│   └── ThemeProvider.tsx
├── content/blog/        # MDX blog posts with frontmatter
├── data/                # Static typed data
│   ├── projects.ts
│   ├── experience.ts
│   └── stack.ts
├── lib/                 # Utilities
│   ├── utils.ts         # cn() helper (clsx + tailwind-merge)
│   ├── posts.ts         # MDX post loader
│   └── date.ts          # Date formatting
├── types/               # Type declarations
├── router.tsx           # Router factory
└── styles.css           # Tailwind v4 + design tokens
```

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 10+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Starts the dev server on `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server on port 3000 (SSR via Nitro) |
| `pnpm build` | Production build + generate sitemap |
| `pnpm build:only` | Vite build only (no sitemap) |
| `pnpm sitemap` | Generate sitemap only |
| `pnpm serve` | Preview production build |
| `pnpm test` | Run Vitest tests |
| `pnpm vitest run <file>` | Run single test file |
| `pnpm vitest --watch` | Watch mode |
| `pnpm tsc --noEmit` | Type-check only |

## Testing

Tests use Vitest with jsdom environment and Testing Library. Test files are co-located next to source files (`module.test.ts` / `module.test.tsx`).

```bash
pnpm test              # Run all tests
pnpm vitest run src/lib/posts.test  # Run single test
```

## Styling

Tailwind CSS v4 is configured via `src/styles.css` using `@import "tailwindcss"` and `@theme` blocks — no `tailwind.config.js` required.

- **Design tokens:** Defined in `@theme` (fonts, type scale, radius, shadows)
- **Color system:** CSS vars as RGB channels: `--background: 9 9 11`
- **Custom layers:** `@layer base`, `@layer components` (glass-panel, glow-card), `@layer utilities`
- **Dark-only** theme currently

## Routing

File-based routing via TanStack Router in `src/routes/`:

- `createFileRoute` for page routes
- `head()` for per-route meta tags and canonical links
- `loader()` for server-side data fetching (SSR)
- `<Outlet />` in `__root.tsx` for layout content

## Content

Blog posts are MDX files in `src/content/blog/` with frontmatter metadata. The MDX pipeline uses:

- `@mdx-js/rollup` for compilation
- `remark-frontmatter` for frontmatter parsing
- `remark-mdx-frontmatter` for frontmatter export
- `remark-gfm` for GitHub-flavored markdown
- Shiki for code syntax highlighting

## Docker

Multi-stage Docker build for production deployment:

```bash
docker build -t personal-website .
docker run -p 3000:3000 personal-website
```

Built image served via `.output/server/index.mjs` with health checks on port 3000.

## Path Aliases

`@/*` maps to `./src/*` — use for internal imports:

```tsx
import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
```
