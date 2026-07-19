# DESIGN.md

> Current design reference for `riyaldi.dev`.
> Use this to understand existing typography, layout, motion, color, and page structure.

## Purpose

`riyaldi.dev` is a personal website for Riyaldi Hasan Setiawan, focused on software engineering, machine learning, Android, web, teaching, and infrastructure work.

## Current Visual Identity

- Dark-first site with a light theme path in CSS variables.
- Clean, restrained surfaces with soft blur and borders.
- Editorial page titles using `text-golden-*` utilities.
- Button, card, and badge primitives provide most repeated UI patterns.

## Typography

- Font import: `Plus Jakarta Sans` from `@fontsource/plus-jakarta-sans`.
- `--font-sans` is defined in `src/styles.css` and used as main family.
- Type tokens in `@theme`:
  - `--text-md: 1rem`
  - `--text-lg: 1.618rem`
  - `--text-xl: 2.618rem`
  - `--text-hero: 4.236rem`
- Headings use the same sans family as body copy.
- Default heading styles use `font-semibold` and `letter-spacing: -0.02em`.

## Color And Theme Tokens

- Base tokens live in `src/styles.css`.
- `:root` sets dark theme values.
- `[data-theme="light"]` overrides the same token set for light mode.
- Semantic tokens used in CSS:
  - `--background`
  - `--foreground`
  - `--card`
  - `--card-foreground`
  - `--popover`
  - `--popover-foreground`
  - `--primary`
  - `--primary-foreground`
  - `--secondary`
  - `--secondary-foreground`
  - `--muted`
  - `--muted-foreground`
  - `--accent`
  - `--accent-foreground`
  - `--destructive`
  - `--destructive-foreground`
  - `--border`
  - `--input`
  - `--ring`
- Body background includes a subtle radial glow via `--glow-soft`.

## Layout

- Main shell uses a vertical app frame with `Header`, `main`, and `Footer`.
- Most pages use `mx-auto max-w-6xl px-5 py-16`.
- Home page uses stacked full-width sections.
- About page uses a single-column editorial layout.
- Projects page uses a split media/details card layout.
- Blog index uses stacked cards.
- Blog detail uses `max-w-3xl` prose layout.

## Motion

- Root wraps children in `MotionConfig reducedMotion="user"`.
- Root `RootComponent` wraps `<Outlet />` in `AnimatePresence mode="wait"` with a 150ms fade transition keyed on pathname for route-level page transitions.
- Shared animation tokens in `src/styles.css` `@theme`:
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` — strong ease-out for UI entrances.
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` — strong ease-in-out for on-screen movement.
- Shared animation configs in `src/lib/animation.ts`:
  - `fadeUp` — `{ opacity: 0, y: 32 }` → `{ opacity: 1, y: 0 }`, 600ms `EASE_OUT`.
  - `fadeOnly` — `{ opacity: 0 }` → `{ opacity: 1 }`, 600ms `EASE_OUT`.
  - `modalContent` — `{ opacity: 0, scale: 0.93 }` → `{ opacity: 1, scale: 1 }`, 250ms `EASE_OUT`.
  - `stagger(index, baseMs)` — returns `{ delay, duration: 0.5, ease: EASE_OUT }` for staggered list entrances.
  - `EASE_OUT` / `EASE_IN_OUT` — exported cubic-bezier arrays for Framer Motion props.
- All page-level `motion.div` entrances use `fadeUp`/`fadeOnly`/`stagger` from `animation.ts` — no inline easing values.
- Header mobile menu uses `AnimatePresence` with `clip-path: inset()` reveal (compositor-only, no layout-thrashing `height` animation), 200ms `EASE_OUT`.
- Mobile menu link block staggers in with `opacity` + `y: -20`, 300ms `EASE_OUT`.
- Image modal uses `fadeOnly` for backdrop and `modalContent` for the image container — `scale(0.93)` instead of `scale(0.9)` for physicality.
- Project card overlay buttons use `transition-opacity transition-transform` (never `transition-all`).
- `Button` base class includes `transition-transform active:scale-[0.97]` for press feedback.
- Blog post list staggers each card at 60ms intervals.

## Components

- `src/components/ui/button.tsx`
  - `Button`
  - `getButtonClasses()`
- `src/components/ui/card.tsx`
  - `Card`
  - `CardHeader`
  - `CardTitle`
  - `CardDescription`
  - `CardContent`
- `src/components/ui/badge.tsx`
  - `Badge`
- `src/components/ImageModal.tsx`
  - lightbox overlay for project screenshots
- `src/components/Header.tsx`
  - sticky navigation with mobile menu
- `src/components/Footer.tsx`
  - footer links and contact block
- `src/components/NotFound.tsx`
  - 404 page used by root route

## Page Composition

### Home

- Hero statement and CTA row.
- Featured projects section.
- Tech stack section.
- Latest notes section.
- Selected project thumbnails open `ImageModal`.

### Projects

- Intro statement.
- Project cards with screenshot, description, stack badges, and external links.
- Screenshot buttons open `ImageModal`.

### Blog

- Journal index with date, title, excerpt, tags, reading time, and read button.
- Blog detail renders MDX content through `mdx-content` styles.

### About

- One-sentence bio statement.
- Grouped skills section.
- Experience timeline sourced from `src/data/experience.ts`.

## Current Accessibility And Interaction Behavior

- Root route has `notFoundComponent` configured.
- `Button` styles are reused for link-like actions through `getButtonClasses()`.
- External links use `rel="noreferrer"`.
- `Header` mobile menu is button-controlled.
- `ImageModal` closes on overlay click.
- `ImageModal` uses `overscroll-contain`.
- Some UI still uses hardcoded `text-white/*`, `border-white/*`, and `bg-white/*` classes.

## Source Files

- `src/styles.css`
- `src/lib/animation.ts`
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/projects.tsx`
- `src/routes/blog.tsx`
- `src/routes/blog.$slug.tsx`
- `src/routes/about.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/ImageModal.tsx`
- `src/components/NotFound.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/data/projects.ts`
- `src/data/experience.ts`
