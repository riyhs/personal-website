# DESIGN.md

> Design source of truth for `riyaldi.dev`.
> Use this before changing typography, layout, motion, color, or page composition.

## Purpose

`riyaldi.dev` is a personal website for a software engineer with machine learning, Android, web, teaching, and infrastructure experience.

The site should communicate:

- Technical clarity.
- Quiet confidence.
- Real project ownership.
- Human teaching/community presence.
- Strong craft without looking like a template.

## Current Design Audit

### What Works

- Clean dark foundation.
- Good contrast in dark mode.
- Simple route structure: Home, Projects, Blog, About.
- Project data, experience data, and stack data already separated from views.
- Tailwind v4 `@theme` tokens already exist in `src/styles.css`.
- Framer Motion is globally configured with `MotionConfig reducedMotion="user"`.
- Core layout uses consistent `max-w-6xl px-5 py-16` rhythm.

### What Feels Generic

- Same glass-card pattern appears on almost every page.
- Same fade-up animation appears on almost every section.
- Same wide uppercase label pattern appears everywhere.
- Typography uses one sans family for every role, so pages lack editorial contrast.
- Golden-ratio type tokens jump sharply and do not feel tuned to content.
- About page is profile card + text column; readable, but not memorable.
- Project cards look like generic portfolio cards instead of case-study proof.
- Light mode support exists, but many classes still hardcode `text-white/*`, `border-white/*`, and `bg-white/*`.

## Design Thesis

### Direction: Technical Editorial / Algorithmic Craft

Build the site like a concise technical magazine profile, not a SaaS landing page.

The visual language should combine:

- Editorial typography.
- Strict grid discipline.
- Low-noise dark surfaces.
- Data/algorithm motifs.
- Precise micro-interactions.
- Project-specific proof blocks.

The site should feel authored. Not louder. More specific.

## Anti-AI-Slop Rules

- No generic purple/blue gradient hero.
- No excessive glassmorphism as default surface language.
- No repeated card grids when content types differ.
- No wide letter-spacing labels everywhere.
- No vague claims like "crafting digital experiences".
- No decorative animations that do not explain hierarchy or action.
- No identical section rhythm from top to bottom.
- No font stack that makes every page feel like a SaaS dashboard.
- No unnecessary 3D/WebGL unless there is a strong concept and performance budget.

## Typography System

### Problem

Current typography uses Plus Jakarta Sans for everything. It is clean, but neutral. Headings, body copy, metadata, and UI labels all share same personality. This makes about page feel flat.

### Target Roles

- Display: editorial, memorable, used for hero and page statements.
- Body: highly readable sans, used for paragraphs and UI.
- Mono: technical metadata, years, stack labels, tiny proofs.

### Recommended Font Pairings

Option A, refined editorial:

- Display: `Instrument Serif`
- Body: `Plus Jakarta Sans`
- Mono: `JetBrains Mono`

Option B, technical magazine:

- Display: `Newsreader`
- Body: `Plus Jakarta Sans`
- Mono: `IBM Plex Mono`

Option C, sharper engineering:

- Display: `Fraunces`
- Body: `Plus Jakarta Sans`
- Mono: `JetBrains Mono`

Preferred: Option A.

Reason: `Instrument Serif` gives name, page titles, and about-page statements real identity without making site ornate. Plus Jakarta Sans can remain for UI/body to minimize disruption.

### Type Rules

- Use display font only for large statements and page titles.
- Use body font for paragraphs, cards, nav, buttons.
- Use mono font for labels, dates, years, stack snippets, small technical facts.
- Use `text-wrap: balance` on headings.
- Use `text-wrap: pretty` on paragraphs where supported.
- Keep body line length around 60-75 characters on desktop.
- Reduce wide label tracking from `0.4em` to roughly `0.12em-0.18em` when using mono.
- Use fluid type tokens with `clamp()` instead of fixed golden jumps.

### Suggested Tailwind v4 Tokens

Use CSS-first tokens in `src/styles.css`:

```css
@theme {
  --font-display: "Instrument Serif", serif;
  --font-sans: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;

  --text-label: clamp(0.72rem, 0.68rem + 0.12vw, 0.8rem);
  --text-body: clamp(1rem, 0.97rem + 0.18vw, 1.125rem);
  --text-lead: clamp(1.125rem, 1.02rem + 0.5vw, 1.45rem);
  --text-title: clamp(2.25rem, 1.4rem + 4vw, 5rem);
  --text-display: clamp(3.2rem, 1.8rem + 7vw, 8.5rem);
}
```

## Layout System

### Current Pattern

Most pages use centered max width with stacked sections. This is safe, but predictable.

### Target Pattern

Use a strict grid with controlled offsets:

- Mobile: 4-column mental grid, single content column.
- Tablet: 8-column mental grid.
- Desktop: 12-column grid inside `max-w-6xl` or `max-w-7xl`.
- Large headings can span 8-10 columns.
- Supporting metadata can sit in narrow side rails.
- Paragraphs should not stretch full container width.

### Page-Level Rhythm

- Home: clear opening statement, then proof blocks.
- Projects: case-study rows with media + metrics + decisions.
- Blog: editorial index, not cards only.
- About: magazine-profile composition, not profile sidebar.

## Color System

### Current Pattern

- Background: near black.
- Foreground: near white.
- Surface: translucent white glass.
- Accent: soft blue glow in card hover.

### Target Pattern

Keep restrained palette, add one authored accent.

Recommended palette:

- Ink: `9 9 11`
- Paper: `250 250 244`
- Muted: `161 161 170`
- Line: `39 39 42`
- Accent: warm amber/rust for personal sections.
- Project accent: optional, per project only.

### Token Rules

- Replace hardcoded `text-white/*` with `text-[rgb(var(--foreground))/N]`.
- Replace hardcoded `border-white/*` with `border-[rgb(var(--border))/N]`.
- Replace hardcoded `bg-white/*` with semantic surface tokens.
- Reserve pure white only for intentional dark-only art moments.

## Motion System

### Current Pattern

Most sections use fade + translate on page load.

### Target Pattern

Use one repeated motif connected to engineering/ML:

- Decode reveal for headings.
- Thin scanline pass on image hover.
- Graph/axis tick reveal for timeline items.
- Subtle project-card media parallax using transform only.

Motion rules:

- Transform + opacity only.
- No `transition-all`.
- Respect root `MotionConfig reducedMotion="user"`.
- Use animation to explain hierarchy, not decorate every element.
- Keep page-level entrance under 600ms.

## Component Direction

### Cards

Reduce default glass effect. Cards should not all look same.

Use variants:

- `editorial-panel`: flat surface, hairline border, low blur.
- `proof-card`: compact stat/metric block.
- `case-study-card`: media-first project block.
- `note-card`: blog/article teaser with strong title hierarchy.

### Buttons

- Maintain pill buttons for primary actions.
- Ensure all sizes meet mobile touch target goals where interactive.
- Use direct labels: `View Selected Work`, `Read Case Study`, `Email Riyaldi`.

### Labels

- Use mono labels.
- Reduce tracking.
- Add semantic value, not decoration. Example: `2024 / MACHINE LEARNING`, not generic `BIO` everywhere.

## About Page Redesign

### Current Issue

`src/routes/about.tsx` currently uses a left profile card and right bio/timeline column. It is functional, but feels like a generic portfolio template.

### Target Feeling

The about page should feel like a technical magazine profile: identity, conviction, proof, teaching, timeline.

### Proposed Structure

1. Hero statement.
2. Portrait rail with location/education facts.
3. Short manifesto paragraph.
4. Three proof counters or facts.
5. Experience timeline with stronger editorial hierarchy.
6. Teaching/community section.
7. Closing CTA.

### Example Content Hierarchy

Hero:

```text
I build learning systems, web platforms, and Android apps that survive real users.
```

Supporting copy:

```text
Computer Science undergraduate at UNS. Machine learning cohort, web lead, Android builder, and facilitator for students learning ML fundamentals.
```

Proof facts:

- `70+` competing teams supported by P!NGFEST platform infrastructure.
- `25` students mentored in machine learning fundamentals.
- `400+` universities represented in Bangkit collaboration network.

### About Layout Sketch

Desktop:

```text
[01 / ABOUT]      [large editorial statement spanning 8 columns]

[portrait rail]   [bio paragraph] [proof stats]
                 [principles / current focus]

[timeline year]   [role, company, summary, impact]
[timeline year]   [role, company, summary, impact]
[timeline year]   [role, company, summary, impact]
```

Mobile:

```text
[ABOUT]
[large statement]
[portrait]
[facts]
[bio]
[timeline]
```

### About Page Rules

- Make one `h1`, then real `h2` section headings.
- Avoid `Bio` as tiny decorative paragraph. Use heading semantics.
- Keep portrait, but stop making it the main design object.
- Use timeline as evidence, not decoration.
- Add richer spacing and asymmetric grid on desktop.
- Keep mobile simple and readable.

## Projects Page Direction

### Current Issue

Projects are presented as cards with screenshots, tags, and links. Good baseline, but not enough proof.

### Target Structure

Each project should show:

- Problem.
- Role.
- Technical decisions.
- Measurable result.
- Stack.
- Links.

### Recommended Project Row

```text
[media, large] [year / domain]
               [project title]
               [one-sentence result]
               [role + decisions + impact]
               [links]
```

Use project-specific accents sparingly. Example: infrastructure/project event can use amber, ML can use cyan, Android can use green.

## Blog Direction

Blog should lean editorial. Avoid all posts looking like generic product cards.

Rules:

- Strong article title measure.
- Mono date + reading time.
- Tags as secondary metadata.
- Blog detail should use display title + refined MDX prose.
- MDX prose line length must stay constrained.

## Accessibility & Web Interface Guidelines Backlog

Use latest Web Interface Guidelines from:

```text
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Known implementation fixes:

- `src/components/ImageModal.tsx`: add dialog semantics, keyboard escape, focus management, image dimensions.
- `src/components/ImageModal.tsx`: avoid clickable div without keyboard handler.
- `src/components/Header.tsx`: add `aria-expanded` and `aria-controls` to mobile menu button.
- `src/components/Header.tsx`: avoid animating height in mobile menu.
- `src/components/Header.tsx`: ensure social icon touch targets reach 44px.
- `src/components/Footer.tsx`: add `aria-hidden` to decorative icons.
- `src/components/Footer.tsx`: avoid `new Date()` in render if hydration stability matters.
- `src/styles.css`: add heading `text-wrap: balance` and paragraph `text-wrap: pretty`.
- `src/styles.css`: fix invalid blockquote background syntax.
- `src/routes/index.tsx`: replace `transition-all` on image overlay button.
- `src/routes/index.tsx`: make hover-only image buttons visible on focus.
- `src/routes/about.tsx`: fix heading hierarchy.
- `src/routes/about.tsx`: replace hardcoded white opacity classes.
- `src/routes/projects.tsx`: make hover-only image buttons visible on focus.
- `src/routes/projects.tsx`: guard long stack text with `min-w-0` and wrapping/truncation.
- `src/routes/blog.tsx`: add `min-w-0` where long titles/tags can overflow.
- `src/routes/blog.$slug.tsx`: replace hardcoded white opacity classes.

## Implementation Sequence

### Phase 1: Foundations

- Add display + mono fonts.
- Replace fixed type tokens with fluid tokens.
- Add semantic utilities for label, display title, prose lead.
- Fix hardcoded white tokens.
- Fix obvious Web Interface Guidelines issues.

### Phase 2: About Page

- Rebuild about page as editorial profile.
- Add proof stats.
- Improve heading hierarchy.
- Keep existing content data, but present it with stronger structure.

### Phase 3: Projects Page

- Convert cards into case-study rows.
- Add role/problem/result fields to project data if needed.
- Improve media hover/focus accessibility.

### Phase 4: Blog & Polish

- Improve blog index typography.
- Improve MDX prose rhythm.
- Add one restrained motion motif.
- Test mobile at 320, 375, 768, 1024, 1440.

## Success Criteria

- About page feels personal and memorable without being noisy.
- Typography has clear roles: display, body, mono.
- Layout uses grid intentionally, not repeated centered cards.
- All theme-aware text uses CSS variable tokens.
- Web Interface Guidelines audit has no high-severity findings.
- Site still feels fast, readable, and accessible on mobile.
