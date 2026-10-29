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

- Font import: `Plus Jakarta Sans` from `@fontsource/plus-jakarta-sans`, weights 400 and 600 only (the only two in use).
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
- Light theme is live: header sun/moon toggle (`useTheme`), choice stored in `localStorage['riyaldi.theme']`.
- Opacity tokens put alpha inside `rgb()`: `text-[rgb(var(--foreground)/0.6)]` labels, `/0.75` body.
- Monospace (`--font-mono`, system stack) is used for meta: `.mono-label`, dates, stack lines, colophon.

## Layout

- Main shell uses a vertical app frame with `Header`, `main`, and `Footer`.
- Single narrow column everywhere: `mx-auto max-w-4xl px-5` (header and footer too).
- Every page except home opens with `PageHeader` (grid backdrop, mono label, h1, lead).
- The hero grid is a 48px drafting grid (`.grid-backdrop`) masked with `linear-gradient(to bottom, black 30%, transparent)`, so it fades toward the bottom. Hovering a cell tints only that cell green (`--grid-hover`); every cell you cross keeps fading on its own, so a sweep leaves a trail of up to 40 cells. Each tint sits inside the masked backdrop, so it dims with the grid (top row measures a 29 green delta, bottom row 3). Cells hold for 250ms, then fade linearly over 1.25s — linear, not ease-out, so the trail stays visible for the whole duration.
- Touch and pen drive the same effect: a tap pulses the cell under the finger, a sideways drag sweeps a trail. The wrapper is `touch-pan-y touch-pinch-zoom`, so a vertical swipe still scrolls (the browser fires `pointercancel`, which releases the grid) and pinch-zoom still works.
- Touch intro (home only, `introRipple` on `PageHeader`): on touch-only devices (`(hover: none) and (pointer: coarse)`), once per browser session (`sessionStorage` key `riyaldi.gridIntro`), 400ms after load the grid is pressed at the centre cell and four rings of cells (1 + 8 + 12 + 16, `rippleRings` in `src/lib/grid.ts`; trail pool raised to 40 to hold them) light 110ms apart, each fading over 700ms with no hold, then the well eases out. Skipped under reduced motion; a touch before or during it cancels it. Measured: lit from ~0.8s to ~1.5s after load, loop idle afterwards.
- Hovering also bends the grid. The lines are drawn on a canvas and resampled through a radial pull toward the cursor — a mass on a rubber sheet, not a perspective trick. Pull peaks at `BEND_STRENGTH` and decays as `e^-(r/R)^2` with `R = BEND_RADIUS`, so the sheet is flat again three radii out and the rest of the grid never drifts. The tint is drawn as the quad between the hovered cell's four bent corners, so it bends with the grid instead of drifting off it. `src/lib/grid.ts` holds the field and the line positions, both unit-tested.
- Content sits in `Section` blocks: `.dashed-rule` top border with `+` crosshair marks, mono label, optional "see all" link.
- Lists are rows with dashed dividers, no cards: projects (thumbnail + text), posts (date column + title), experience (period column + details), stack/skills (label column + items).
- Blog detail prose is capped at `max-w-3xl` inside the column.

## Motion

- Root wraps children in `MotionConfig reducedMotion="user"`.
- Route changes are view transitions (`defaultViewTransition: true` in `src/router.tsx`). The root cross-fades in 150ms `--ease-out`; a project thumbnail (home, /projects) and its case-study hero share `view-transition-name: project-shot-<slug>` (`projectShotTransition()` in `src/data/projects.ts`), so the image morphs over 400ms, both ways. The hero sits outside the case-study fade-up, since a fading target would morph into nothing. Under `prefers-reduced-motion: reduce` the transition animations are off. While a transition runs, the header bar (`.site-header > div`, the element with `backdrop-filter`) is its own snapshot stacked above the rest (`z-index: 1` on its group), so the morph passes under the bar. The spec copies a captured element's `backdrop-filter` onto its `::view-transition-group`, so the bar stays blurred during the transition (Chrome verified; Firefox copies it too per `ViewTransition.cpp`). The name is applied only during a transition, because a named element is always a backdrop root. Browsers without View Transitions get an instant swap.
- Shared animation tokens in `src/styles.css` `@theme`:
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` — strong ease-out for UI entrances.
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` — strong ease-in-out for on-screen movement.
  - `--default-transition-timing-function: var(--ease-out)` — every Tailwind `transition-*` utility inherits the repo curve instead of Tailwind's weaker default, so hovers match the entrance motion.
- Theme swaps blend over 500ms `ease` (250ms read as a flash; doubled at user request). The backdrop, header bar, footer, rules and text all ease together.
  - The backdrop is a fixed, viewport-sized `body::before` layer (solid colour, no glow). A background propagated to the viewport canvas cannot be transitioned, and animating a full-height wrapper instead measured p95 33ms.
  - `body` no longer paints `--glow-soft`: it was never visible (the layout wrapper's opaque background covered it), and once that wrapper went transparent the glow washed the dark background grey.
  - `color` transitions go only on elements that set their own colour (`h1-h4`, `p`, `li`, `.mono-label`, `.lead-text`, `.item-text`). Adding them to inheriting children makes each child retarget its parent's moving value every frame — hundreds of cancelled transitions and a fade that overshoots its duration.
  - Measured: 202 transitions, 0 cancels, median ~240ms, p50/p95 frame gap 17ms.
- Never stack `transition-colors transition-shadow transition-transform` — each sets `transition-property` and the last one wins, silently leaving colours and shadow with no transition. Use `transition` (Tailwind v4's full list includes colour, shadow, transform and scale; not layout).
- Entrance animations are CSS, defined in `@theme` in `src/styles.css` so they run on first paint (no JS, no SSR `opacity: 0`):
  - `animate-fade-up` — opacity + `translateY(32px)`, 600ms `--ease-out`. Used by `PageHeader`, case-study body.
  - `animate-fade-in` — opacity only, 600ms. Used by `Section`, blog body; also the reduced-motion fallback via `motion-reduce:`.
  - Stagger with `[animation-delay:100ms]`.
- `src/lib/animation.ts` keeps only `EASE_OUT` / `EASE_IN_OUT` for the Motion (`motion/react`) mobile menu. The menu uses `LazyMotion strict` + `m.div`; the animation features (~18 KB gz) are a separate chunk (`src/lib/motionFeatures.ts`) fetched after hydration, not part of the entry bundle.
- Never gate content visibility on `whileInView` (Firefox left sections stuck at opacity 0 after back navigation).
- Header mobile menu uses `AnimatePresence` animating `height` + `opacity`, 200ms `EASE_OUT`.
- Mobile menu link block staggers in with `opacity` + `y: -20`, 300ms `EASE_OUT`.
- `Button` base class uses `transition duration-150` (colour + shadow + `active:scale-[0.97]`), so hover and press both ease on the repo curve.

## Components

- `src/components/ui/button.tsx`
  - `Button`
  - `getButtonClasses()`
- `src/components/PageHeader.tsx`
  - page intro: grid backdrop, mono label (accepts nodes, e.g. back link), h1, lead, children
- `src/components/GridBackdrop.tsx`
  - hero grid + hover trail; owns the pointer listener, the bend field and the canvas. Grid maths in `src/lib/grid.ts` (`cellFromPoint` / `cellPosition` / `bendPoint` / line positions), all mirroring the grid's `background-position: center top`. The canvas reproduces the CSS grid line for line, so the static `background-image` stays only as the pre-hydration paint and is dropped via `data-canvas` once drawing starts. Lines outside three bend radii are stroked as plain two-point segments; everything goes into one path with one `stroke()`, which is what keeps a software canvas at 60fps. The loop stops when the well has settled and no cell is still ramping or fading (measured 0 rAF/s at rest), so a lit cell under a resting cursor costs nothing. Under `prefers-reduced-motion: reduce` there is no bend and no trail: the grid stays flat and only the hovered cell is lit.
- `src/components/Section.tsx`
  - dashed-rule section with mono label and optional link
- `src/components/Header.tsx`
  - sticky navigation with `/logo.svg` mark, mobile menu, theme toggle
- `src/components/Footer.tsx`
  - availability line, colophon grid (build SHA/date, deploy, source, typeface, llms.txt/index.md, stack), nav, contact
- `src/components/NotFound.tsx`
  - 404 page used by root route (uses `PageHeader`)

## Page Composition

### Home

- Hero: mono tagline, full-name h1, summary + recent lines from `src/data/profile.ts`, CTA row with social icons.
- Selected work rows linking to case studies.
- Stack table from `src/data/stack.ts`.
- Recent writing as dated rows.

### Projects

- `PageHeader`, then one row per project: thumbnail, year · platform, title, description, mono stack line, case-study + external links.
- `/projects/$slug` case study: back link, metadata grid (role/platform/year/stack), links, screenshot, optional highlights.

### Blog

- `PageHeader`, then dated rows with title, excerpt, reading time and tags.
- Blog detail (`blog_.$slug.tsx`, sibling route so it doesn't inherit `/blog` head tags): `PageHeader` with back link, date and reading time; tags as `#tag`; MDX through `mdx-content` styles. Unknown slug -> `notFound()` (404).

### About

- `PageHeader` with one-sentence bio.
- Skills table (label column + items).
- Experience rows sourced from `src/data/experience.ts`.

## Current Accessibility And Interaction Behavior

- Root route has `notFoundComponent` configured.
- `Button` styles are reused for link-like actions through `getButtonClasses()`.
- External links use `rel="noreferrer"`.
- `Header` mobile menu is button-controlled.
- Theme toggle is a `button` with `aria-pressed`; icon swaps via the `light:` CSS variant so it matches the pre-hydration theme.
- `/llms.txt` and `/index.md` server routes expose site content as text for agents.

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
- `src/components/PageHeader.tsx`
- `src/components/Section.tsx`
- `src/components/NotFound.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/data/projects.ts`
- `src/data/experience.ts`
