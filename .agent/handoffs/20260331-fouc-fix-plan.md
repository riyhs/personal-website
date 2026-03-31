# PLAN: Fix FOUC / Hydration Mismatch — Phase 1

**Date:** 2026-03-31 | **Branch:** `experiment` | **Assignee:** small model
**Files to touch:** `src/routes/__root.tsx`, `src/components/ThemeProvider.tsx`
**Do NOT touch:** route structure, visual layout, TanStack package versions, `src/lib/date.ts`

---

## Problem Summary

The site has a Flash of Unstyled Content (FOUC) and React hydration mismatch warnings. Two root causes were identified:

1. **Browser-injected `<body>` attributes** — Extensions/browsers add attributes to `<body>` that differ from SSR HTML, causing hydration mismatch.
2. **ScriptOnce placement** — The current `ScriptOnce` is inside `<body>`, but the official TanStack docs show the theme script should apply a **class** to `<html>`, and the `ScriptOnce` component should be used outside the hydration-sensitive tree (or the elements it modifies must have `suppressHydrationWarning`).

The date formatting issue has already been fixed (`src/lib/date.ts` uses deterministic `en-GB` + `UTC` — all date renders use it). No further date changes needed.

---

## What's Already Done (protect these)

- `suppressHydrationWarning` on `<html>` and `<body>` ✅
- `ScriptOnce` theme bootstrap script in `__root.tsx:98` ✅
- `ThemeProvider` reads DOM state from `ScriptOnce` via `dataset.theme` ✅
- Deterministic UTC date formatting in `src/lib/date.ts` ✅
- All date renders use `formatShortDate`/`formatLongDate` ✅

---

## Root Cause Analysis

### Issue 1: ScriptOnce modifies `style.colorScheme` on `<html>` — not a class

The TanStack docs example uses `document.documentElement.classList.add(resolved)` to apply a **CSS class**. Our script instead sets `document.documentElement.style.colorScheme` and `dataset.theme`. The inline `style` attribute set by the script creates an SSR/client mismatch because the server-rendered `<html>` has no `style` attribute, but after the script runs, it does. `suppressHydrationWarning` on `<html>` should catch this — **verify it actually does**.

### Issue 2: ThemeProvider may double-apply on hydration

`ThemeProvider` calls `syncDomTheme(theme)` in a `useEffect` on mount, which sets `style.colorScheme` and `dataset.theme` again. On SSR, `getInitialTheme()` returns `'dark'` (server default). On the client, it reads the DOM state set by `ScriptOnce`. If these disagree (e.g., user has `'light'` stored), there's a flash during the first React render before `useEffect` fires.

**The real problem:** `useState(() => getInitialTheme())` runs during React's render phase on the client. During hydration, React expects the initial render to match the server. If the server rendered `'dark'` but the client's `getInitialTheme()` returns `'light'` (from localStorage/DOM), the tree below ThemeProvider may render differently, causing a mismatch.

### Issue 3: ScriptOnce is inside `<body>` but modifies `<html>`

This is fine per the docs — `ScriptOnce` can be placed in body and modify any DOM. But the script should also set a `class` rather than only `style.colorScheme`, because CSS vars in `styles.css` likely toggle based on `[data-theme="light"]` selector, and the flash happens in the gap between script execution and CSS application.

---

## Fix Plan (step by step)

### Step 0: Research — Read TanStack docs via CLI

Before coding, run these commands to confirm the latest API patterns:

```powershell
tanstack doc router guide/document-head-management --json
tanstack doc start framework/react/guide/hydration-errors --json
tanstack search-docs "ScriptOnce theme class" --library start --json
```

Compare the docs' `ScriptOnce` example with our implementation. The docs show:
```js
document.documentElement.classList.add(resolved)
```
Our code does:
```js
document.documentElement.style.colorScheme = r
if (r === 'light') document.documentElement.dataset.theme = 'light'
```

Decide which approach to use based on how `styles.css` applies theme colors.

---

### Step 1: Verify how CSS theme switching works

Read `src/styles.css` and search for how `--background`, `--foreground`, and other color vars toggle between dark/light. Specifically look for:
- `[data-theme="light"]` selectors
- `color-scheme` usage
- `.dark` / `.light` class selectors
- `prefers-color-scheme` media queries

This determines what the ScriptOnce script needs to set on the DOM.

---

### Step 2: Fix ScriptOnce to match CSS selector mechanism

Based on Step 1 findings, update the `ScriptOnce` inline script in `src/routes/__root.tsx:98`.

**If CSS uses `[data-theme="light"]`:** Keep `dataset.theme` approach but also set `class` for `color-scheme`:
```js
(function(){try{var t=localStorage.getItem('riyaldi.theme')||'dark';var r=t==='auto'?(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):t;document.documentElement.dataset.theme=r;document.documentElement.style.colorScheme=r}catch(e){}})()
```
Key change: always set `dataset.theme` to the resolved value (not just for light), so that `getInitialTheme()` can reliably read it.

**If CSS uses class-based (`.dark`/`.light`):** Switch to class approach per TanStack docs:
```js
(function(){try{var t=localStorage.getItem('riyaldi.theme')||'dark';var r=t==='auto'?(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):t;document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r}catch(e){}})()
```

---

### Step 3: Fix ThemeProvider SSR/client initial state alignment

**File:** `src/components/ThemeProvider.tsx`

**Problem:** Server always returns `'dark'`, client may return `'light'` from DOM/localStorage. This causes hydration mismatch in child components that conditionally render based on theme.

**Fix approach — use `useSyncExternalStore` pattern or defer to `useEffect`:**

Option A (simpler, recommended): Make server and client initial state always match during hydration, then correct in `useEffect`:

```tsx
// Always start with 'dark' to match SSR, then sync from DOM in useEffect
const [theme, setThemeState] = useState<ThemeMode>('dark')
const [isHydrated, setIsHydrated] = useState(false)

useEffect(() => {
  // Read what ScriptOnce already applied to DOM
  const domTheme = document.documentElement.dataset.theme
  const resolved: ThemeMode = domTheme === 'light' ? 'light' : 'dark'
  setThemeState(resolved)
  setIsHydrated(true)
}, [])
```

But this causes a flash (theme starts dark, then flips to light after effect). The ScriptOnce already set the CSS, so visually it's fine — only the React state lags. Components that read `useTheme().isDark` would briefly get wrong value.

Option B (better): Keep `getInitialTheme()` but ensure it ALWAYS returns `'dark'` during hydration by checking if we're in a hydration pass:

```tsx
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark'
  // During hydration, return 'dark' to match server
  // ScriptOnce already applied the visual theme to DOM
  // We'll sync React state in useEffect
  return 'dark'
}
```

Then in `useEffect`:
```tsx
useEffect(() => {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (stored === 'light' || stored === 'dark') {
    setThemeState(stored)
  } else if (matchMedia('(prefers-color-scheme: light)').matches) {
    setThemeState('light')
  }
  // DOM is already correct from ScriptOnce, just sync React state
}, [])
```

**Why this works:** ScriptOnce already applied the correct theme to the DOM (classes/attributes/colorScheme) before React hydrates. The visual appearance is correct from the start. React state starts as `'dark'` to match SSR HTML. After hydration, `useEffect` syncs React state to match what ScriptOnce applied. Since the DOM was already correct, there's no visual flash.

---

### Step 4: Ensure `syncDomTheme` doesn't fight ScriptOnce

The `useEffect` that calls `syncDomTheme(theme)` on theme changes should NOT run on mount during hydration (it would redundantly set what ScriptOnce already set, potentially causing a brief reflow).

Add a ref to skip the first render:
```tsx
const isFirstRender = useRef(true)

useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false
    return
  }
  syncDomTheme(theme)
}, [theme])
```

Or simpler: since `syncDomTheme` is idempotent and sets the same values ScriptOnce already set, it's harmless. Only add the ref guard if you observe a flash.

---

### Step 5: Verify `suppressHydrationWarning` coverage

Confirm these are present (they already are, but verify after changes):

- `<html lang="en" suppressHydrationWarning>` — covers `style`, `data-theme`, `class` changes by ScriptOnce
- `<body suppressHydrationWarning>` — covers browser extension injections

**Do NOT** add `suppressHydrationWarning` to any other elements. It's a last resort per TanStack docs.

---

### Step 6: Build and verify

```powershell
pnpm build
```

Must succeed with zero errors.

```powershell
pnpm dev
```

Open in browser:
1. Check console for hydration mismatch warnings
2. Hard refresh with DevTools → Network → "Disable cache" checked
3. Test with `localStorage.setItem('riyaldi.theme', 'light')` then refresh — no flash
4. Test with `localStorage.removeItem('riyaldi.theme')` then refresh — no flash
5. Check all 5 routes: `/`, `/about`, `/blog`, `/blog/[any-slug]`, `/projects`

---

### Step 7: Update handoff and blueprint

If fix is confirmed:

```
FILE: .agent/handoffs/20260331-fouc-hydration-fix.md
ACTION: REPLACE
LOCATION: line 2, line 25-26

<<<
Date: 2026-03-31 | Type: ANALYSIS | Blocking: Y | Status: PENDING
>>>
Date: 2026-03-31 | Type: ANALYSIS | Blocking: N | Status: RESOLVED
```

```
<<<
Resolved by: — | Date: — | Summary: — | Resume at: Phase 2 SEO implementation after handoff capture
>>>
Resolved by: [model] | Date: [today] | Summary: Fixed hydration mismatch by aligning SSR/client initial theme state and ensuring ScriptOnce matches CSS selector mechanism | Resume at: Phase 2 SEO implementation
```

Mark blueprint tasks 1.1–1.4 as `[x]` in `.agent/BLUEPRINT.md`.

---

## TL;DR for the executing model

1. Read `src/styles.css` — find how theme colors toggle (data-attribute? class? media query?)
2. Update `ScriptOnce` script to set the correct DOM state that CSS expects
3. Fix `ThemeProvider` to return `'dark'` during initial render (match SSR), then sync from DOM in `useEffect`
4. Verify `suppressHydrationWarning` is on `<html>` and `<body>`
5. `pnpm build` — must pass
6. `pnpm dev` — check console for hydration warnings on all routes
7. Mark handoff resolved, update blueprint

## CLI commands for research during execution

```powershell
tanstack doc router guide/document-head-management --json
tanstack doc start framework/react/guide/hydration-errors --json
tanstack doc start framework/react/guide/selective-ssr --json
tanstack search-docs "ClientOnly fallback" --library start --json
```
