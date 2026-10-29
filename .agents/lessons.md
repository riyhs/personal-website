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

## 2026-08-23 Removed blur for Firefox when user wanted fetchz-like smoothness -> Copy the reference site's parameters first

### Problem
User asked how fetchz.vercel.app keeps background blur smooth in Firefox and wanted the same here. Agent's first fix disabled backdrop-filter for Firefox entirely; user corrected: they want working blur, not removal.

### Root Cause
Our blurred surfaces used larger radii than the reference (glass-panel 18px, sticky header 24px vs fetchz's uniform 12px). Radius x area is what makes Gecko's per-frame re-filtering jank, not backdrop-filter itself.

### Fix
.glass-panel blur went 18px -> 12px, header blur 24px -> 12px (now 8px); deleted the Firefox only fallback block entirely.

### Rule
When a reference site does an effect smoothly, measure and copy its concrete parameters (radii, layer count, what sits behind) before adding browser-detection fallbacks.

## 2026-10-22 Opacity token syntax was invalid site-wide -> Verify arbitrary-value classes in compiled CSS

### Problem
The documented convention `text-[rgb(var(--foreground))/0.75]` compiled to `color: rgb(var(--foreground))/.75`, which is invalid CSS. Browsers dropped it, so every "muted" text rendered at full strength for months. Found while adding light mode.

### Fix
Moved alpha inside `rgb()`: `text-[rgb(var(--foreground)/0.75)]` (28 occurrences). Labels raised 0.5 -> 0.6 for AA on the light background.

### Rule
When a Tailwind arbitrary value carries a modifier, grep the built CSS for the generated rule before standardizing it. `bg-[rgb(var(--x))]/55` (modifier outside brackets) is valid; `/N` inside the brackets after `rgb(...)` is not.

## 2026-10-22 Sections blank after browser back -> Don't gate content on scroll-triggered animation

### Problem
User reported lists (projects, posts, skills) blank after opening a detail page and going back; only a reload fixed it. Agent's Chromium tests passed; the bug only reproduced in Firefox.

### Root Cause
`__root.tsx` wraps a live `<Outlet />` in a keyed `AnimatePresence mode="wait"`, so on navigation the exiting wrapper briefly renders the destination page and the page remounts. `Section` used `whileInView` (`once: true`); across that remount Firefox left in-view sections at inline `opacity: 0`.

### Fix
`Section` uses mount `animate` instead of `whileInView`. Verified with a Firefox back/forward suite (8 scenarios, 3 runs, all sections visible).

### Rule
Content must never depend on IntersectionObserver-driven animation. Test navigation flows in Firefox too (`pnpm exec playwright install firefox`), not just Chromium.


## 2026-10-22 Stale test server answered a before/after comparison -> Own the port before measuring

### Problem
During the Vite 8 upgrade, servers started with `cd dir; node output/server/index.mjs &` were "stopped" with `pkill -f "$ABS_PATH/server/index.mjs"`. The pattern never matched the relative command line, so six servers kept running. The next "after" server could not bind its port and the check silently hit the old build.

### Fix
Stop servers by PID (`node ... & PID=$!; ...; kill $PID`) and confirm the port belongs to that PID (`ss -ltnp | grep ":PORT .*pid=$PID"`) before reading results. Re-ran the affected check.

### Rule
For any before/after comparison, use a fresh port per run, verify which process owns it, and kill by PID. Never `pkill -f` with a pattern that also matches the current shell.


## 2026-10-23 Page fade replayed the old page on first visits -> Key transitions on rendered matches

### Problem
The page fade wrapper in `__root.tsx` was keyed on `location.pathname`. TanStack Router sets `location` when navigation starts, but keeps rendering the old matches until an unvisited route's code chunk (and loader) is ready. The wrapper remounted early, the old page blinked and faded back in, then the new page popped in without a fade. Cached routes render in the same frame, so second visits looked fine.

### Fix
Key on the committed leaf match: `useRouterState({ select: (s) => s.matches.at(-1)?.id })`. Verified with a per-frame rAF log in Chromium at 150 ms and 1500 ms latency: the remount frame already holds the new page.

### Rule
Anything that should react to "the page changed" (transitions, focus, analytics) reads `matches` or `resolvedLocation`, not `location`. Reproduce timing bugs with a throttled, frame-by-frame log on a cold cache, not by eye.

## 2026-10-28 Grid hover handler cost 428us per cell -> Cache the rect, never read layout after writing

### Problem
The hero grid hover effect measured 428us per cell change in a synthetic benchmark, while a plain `getBoundingClientRect()` measured 1.4us. On a slow device a fast diagonal swipe could push that into visible jank.

### Root Cause
The pointermove handler wrote `classList` and `--cell-*` custom properties, then the *next* pointermove called `getBoundingClientRect()` on the backdrop. Style was already dirty, so every read forced a synchronous style recalc + layout of the page. Classic read-after-write thrash inside one hot handler.

### Fix
Measure the backdrop once into a ref, refresh it on `pointerenter`, `resize` and `scroll`, and never touch layout inside pointermove. 428us -> 30.6us, which is the same as the early-return path (the rest is React's event dispatch).

### Rule
A pointermove/scroll handler must not call `getBoundingClientRect()` (or any layout read) if it also writes styles. Cache the box and invalidate it on `resize`, `scroll` and `pointerenter`. Benchmark with synthetic `new PointerEvent('pointermove', { pointerType: 'mouse' })` dispatches, not with `page.mouse.move` — CDP round-trips (~17ms each) hide the handler cost completely.

## 2026-10-28 Aligning an overlay to a CSS grid background -> Whole-tile background-position steps (superseded, see below)

### Problem
The hover tint had to land exactly on a 48px square of an existing `background-position: center top` grid, at any viewport width. Computing the pixel origin in JS would need re-measuring on every resize and would drift on fractional widths.

### Fix
Give the overlay the same `background-size: 48px 48px` with `background-repeat: no-repeat` and position it with `background-position: calc(50% + (var(--cell-col) * 48px)) calc(var(--cell-row) * 48px)`. For background-position, 50% resolves against (area width - image width), which is exactly the grid's centered origin, so adding whole tiles stays aligned for free.

### Rule
To place something on a repeated background's tile, offset from the background's own positioning keyword in whole `background-size` steps. Only the index needs JS, never the geometry.

### Superseded 2026-10-28
This is right for *one* overlay and wrong for *many*. The trick needs each overlay to be `inset: 0`, i.e. viewport-sized, so a pool of 32 tint layers meant 32 full-size layers to composite and animate. Switched to 48x48 elements moved with `transform`, positioned from the already-cached backdrop rect. Same alignment (the round-trip is unit-tested), but each fade is a compositor-only opacity change on a 48x48 layer. Keep the background-position trick for a single decoration; use sized, transformed elements when the count can grow.

## 2026-10-28 A 1s "fade" read as a 300ms flick -> Pick the easing by what the effect is for

### Problem
The hero grid tint was set to fade over 1s with `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`). User reported the highlight vanished almost instantly. The duration was 1s, but that curve is ~85% done at 20% of the duration, so the trail was gone in ~300ms.

### Root Cause
`--ease-out` is the right curve for an *entrance* (fast start, settle into place). For a *decay* it front-loads the disappearance, which reads as shorter than the stated duration. The user asked for a longer duration, but lengthening the same curve barely helps.

### Fix
`transition: opacity 1250ms linear 250ms`. Linear decays at a constant rate, so the trail is evenly weighted and lasts the full stated duration. Verified: holds at 1.00 through the 250ms delay, then 0.96 / 0.80 / 0.64 / 0.48 / 0.32 / 0.16 / 0.00 at 200ms intervals, zero at 1500ms.

### Rule
Ease-out for entrances, linear for decay trails, ease-in-out for on-screen movement. When a user says an animation feels too fast, check the curve before the duration — and never claim a duration without sampling the computed opacity over time.

## 2026-10-28 Fast pointer movement left a faint trail -> Keep the entry ramp shorter than the crossing time

### Problem
Cells lit up over 180ms, but a fast flick crosses a 48px cell in 16-50ms, so every cell was abandoned at ~0.37 opacity and the trail looked washed out instead of green.

### Fix
Entry transition 180ms -> 90ms. Cells crossed in one frame now peak at ~0.9+ instead of 0.37. Measured a 13-cell sweep going from 0.4-0.82 opacity to 0.71-0.98.

### Rule
An entry animation must finish inside the shortest time the pointer can spend on the element, or fast input never reaches full visual weight. Verify with a one-cell-per-frame synthetic sweep, not a slow human-speed one.

## 2026-10-28 Three stacked `transition-*` utilities silently cancelled two of them

### Problem
The primary button used `transition-colors transition-shadow transition-transform`. Hover background and shadow snapped instantly; only the press scale animated.

### Root Cause
Each Tailwind `transition-*` utility emits its own rule setting `transition-property`. They all have the same specificity, so the last one in the stylesheet wins — `transition-transform` — leaving `background-color` and `box-shadow` with no transition. `getComputedStyle(btn).transitionProperty` returned exactly `transform, translate, scale, rotate`, which is how it was caught.

### Fix
One `transition` utility (Tailwind v4's full list covers colour, shadow, transform, translate, scale, rotate — not layout properties). Verified the hover now ramps alpha 1 -> 0.956 -> 0.927 -> ... -> 0.9 over ~9 frames.

### Rule
Never stack `transition-*` utilities on one element. Pick the single one that covers every property you animate, and check `transitionProperty` in computed style rather than trusting the class list.

## 2026-10-28 Animating a theme swap across every element costs 30fps -> switch in one frame

### Problem
`body` had `transition: background-color 300ms, color 300ms` while the header bar, cards, rules and text snapped instantly. Mid-swap the header was already near-white while the body was still mid-grey — visibly mismatched for 300ms.

### Root Cause
Theme tokens are CSS variables consumed by hundreds of elements. Only `body` opted into a transition, so everything else flipped at once while the background lagged.

### Fix attempt that failed
A zero-specificity `:where(*) { transition-property: color, background-color, border-color; transition-duration: 300ms }` made every surface ease in lockstep — and dropped the swap to ~30fps (25 frames vs 53 idle, p50 33.4ms). Repainting the colour of every element per frame is not cheap.

### Fix
Remove the theme colour transition entirely. Everything switches in one frame: verified body, header bar and body text all settled on the same frame.

### Rule
A theme swap changes colour on the entire page. Either switch it in one frame, or don't animate it — per-element colour transitions are not a budget you can afford site-wide. Measure a theme toggle with a rAF frame log; a "smooth" fade can be the slowest thing on the site.

## 2026-10-28 Three separate reasons a theme fade looked like a snap

### Problem
After adding colour transitions for the theme swap, the page background still jumped instantly while the header eased.

### Root causes (all three had to be fixed)
1. **The root layout div was painting over the backdrop.** `__root.tsx` wrapped everything in `bg-[rgb(var(--background))]` — an opaque, non-transitioning background covering the viewport. Nothing behind it could ever show.
2. **Canvas propagation.** `body`'s background is propagated to the viewport canvas, and a propagated background is not animated. Moving it to `html` doesn't help either — the root's background is propagated the same way. The backdrop has to be a real painted element (`body::before`, `position: fixed`, `z-index: -1`, `pointer-events: none`) with `body` transparent.
3. **Inheriting children retargeted their parent.** With `body` transitioning `color` and children also transitioning `color`, every frame the inherited value moved, so each child restarted its transition: hundreds of `transitioncancel` events and a fade that ran to 795ms instead of 250ms. Only elements that set their own colour need a transition; children follow for free.

### Verification
`transitionrun`/`transitionend`/`transitioncancel` counts (bubbling, so listen with capture): 206 run / 206 end / **0 cancel**, median 180ms, last 271ms. Frame gaps p50/p95 = 17ms during the swap. To prove a backdrop blends at all, stretch the duration with an injected 3s `!important` and screenshot mid-way — a 250ms fade is impossible to time reliably with screenshots.

### Rule
When a full-page colour change won't animate, check in this order: is something opaque painted above the layer, is the background propagated to the canvas, and is a child inheriting an already-animating colour. All three produce the identical symptom.

## 2026-10-28 Warping a DOM layer cannot follow a warped grid

### Problem
The hovered cell was a 48px `<span>` positioned with `translate3d` while the grid lines bent. It looked detached: the cell stayed rigid and axis-aligned while the cell it was supposed to represent tapered and shifted.

### Why
A single element can only be translated, scaled or rotated — an affine transform maps a rectangle to a parallelogram. The bent cell is a general quad, so no transform can match it. Four independent corners are needed.

### Fix
Draw both on one canvas. The grid is resampled per line; the tint is filled as the quad between the cell's four bent corners. Both share `bendPoint`, so they cannot drift apart. The trail timing moved from CSS transitions into the frame loop (`ENTER_MS` 90 ramp, `HOLD_MS` 250, `FADE_MS` 1250, linear).

### Two performance traps found in the same pass
1. **The loop never stopped.** A lit cell whose ramp had finished still reported "live", so rAF ran at 60/s while the cursor rested. Only cells that are still ramping or fading keep the loop alive; measured 0 rAF/s at rest now.
2. **One `stroke()` per line.** 36 stroked paths on a software canvas cost real frames in Firefox (p95 35ms). Putting every line into one path and stroking once, and stroking only two-point segments outside three bend radii, brought p95 to ~20ms.

### Rule
If two layers must look like the same object under a non-uniform warp, they must be drawn in the same pass. And a canvas render loop needs an explicit "what can still change" predicate, or it becomes a 60fps idle burn.

## 2026-10-29 View transitions broke the blurred header bar (two bugs)

### Problem
1. Firefox: the header bar lost its blur and read as transparent for the whole transition, most visibly on back (scroll restored, text under the bar). User-confirmed with a no-op `document.startViewTransition(() => {})` slowed to 5s, so no navigation or scroll was involved.
2. Both browsers: the morphing project image flew over the header. Named elements are lifted into the `::view-transition` overlay, which sits above the root snapshot, header included.

### Fix attempt that failed
A denser tint during the transition (`html:active-view-transition header > div { background-color: ... / 0.9 }`). Headless Firefox showed the denser bar, but the user's real Firefox stayed transparent. Most likely hardware WebRender drops the whole backdrop-filtered element, background included, inside snapshots, so no background change can show. The selector also hit `PageHeader`'s `<header>` children.

### Fix
`html:active-view-transition .site-header > div { view-transition-name: site-header }` plus `::view-transition-group(site-header) { z-index: 1 }`. The name sits on the bar itself, the element carrying `backdrop-filter`: CSS View Transitions 1 copies a captured element's backdrop-filter onto its `::view-transition-group`, so the blur is applied live over the transition (WPT `backdrop-filter-captured.html`; Firefox's `ViewTransition.cpp` copies it too). Verified in Chromium: blur kept mid-transition, image under the bar.

Failed on the way: a 0.9 tint during transitions (Firefox still see-through, then reverted because it read as the blur going away); a permanent name on `<header>` (backdrop root, so no blur anywhere at rest); the name on `<header>` only during transitions (Chrome lost the blur mid-transition: the blurred child's backdrop root was the empty header).

### Rule
Never rely on `backdrop-filter` inside a view transition. Put `view-transition-name` on the element that carries `backdrop-filter`, never on an ancestor of it, and only while a transition runs. Cross-browser background: Chrome blurs inside page snapshots, Firefox and Safari don't (WebKit bug 302256). Scope selectors to the site header (`.site-header`), because `PageHeader` renders a `<header>` too. Headless Firefox renders no backdrop-filter at all, so blur bugs need a real Firefox, and a fix that only passed headless is unverified.
