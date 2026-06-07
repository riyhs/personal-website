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
- About page uses a two-column layout on larger screens.
- Projects page uses a split media/details card layout.
- Blog index uses stacked cards.
- Blog detail uses `max-w-3xl` prose layout.

## Motion

- Root wraps children in `MotionConfig reducedMotion="user"`.
- Pages use `framer-motion` entrance animations with opacity and `y` offset.
- Header mobile menu uses `AnimatePresence` and `motion.div`.
- Image modal uses `AnimatePresence` and scale/opacity transitions.

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

- Profile card with portrait and location/education/specialization facts.
- Bio copy.
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
