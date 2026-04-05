# PLAN: Fix FOUC — Phase 2 (Research-Based)

**Date:** 2026-03-31 | **Branch:** `experiment` | **Based on:** `.agent/research/fouc-research-solutions.md`

---

## Why Phase 1 Failed

Phase 1 fixed ScriptOnce and ThemeProvider alignment but **did not add any CSS mechanism for theme switching**. `src/styles.css` only has `:root` dark vars — no `[data-theme="light"]` or `.light`/`.dark` overrides. ScriptOnce sets `dataset.theme` and `style.colorScheme` but CSS has nothing to act on. The page always renders dark because that's the only theme CSS defines.

---

## Three Approaches Evaluated

Based on research from 7 sources (TanStack docs, Leonardo Montini, Ish Chhabra, Dennis Kinuthia, Nisab Mohd, GitHub #2589, Josef Bender):

### Approach A: localStorage + ScriptOnce + CSS Class Overrides (Recommended)
**Sources:** TanStack docs, Leonardo Montini, Dennis Kinuthia, Josef Bender
**Pros:** No server round-trips, instant toggle, no cookie overhead
**Cons:** Server doesn't know user's theme preference
**Changes needed:**
1. Add `[data-theme="light"]` block in `styles.css` with light color vars
2. Update ScriptOnce to use `classList.add('dark'/'light')` (per TanStack docs official example)
3. Update `syncDomTheme` to toggle classes instead of dataset

### Approach B: Cookie-Based SSR (Most Robust)
**Sources:** Ish Chhabra, Nisab Mohd
**Pros:** Server sends correct HTML, truly zero flash, server knows theme
**Cons:** Toggle requires server round-trip (mitigated with `useOptimistic`), client cache needed for fast navigation
**Changes needed:**
1. Create `src/lib/theme.ts` with `createServerFn` + cookie get/set
2. Add `beforeLoad` in `__root.tsx` to read theme from cookie
3. Apply `className={theme}` on `<html>` in RootDocument
4. Remove ScriptOnce entirely (not needed — SSR sends correct HTML)
5. Add `useOptimistic` for instant toggle feedback

### Approach C: Hybrid — Cookie SSR + ScriptOnce Fallback
**Pros:** Best of both — SSR correct on first load, ScriptOnce handles client-side navigations
**Cons:** Most complex, two sources of truth
**Not recommended** — overkill for a dark-only site.

---

## Recommended: Approach A (localStorage + CSS Class Overrides)

### Rationale
- Minimal changes — only CSS + small ScriptOnce adjustment
- No server functions, no cookies, no `useOptimistic` complexity
- Matches TanStack official docs example exactly
- Site is currently dark-only with no light theme toggle UI — no need for cookie-based SSR awareness
- If a light theme toggle is added later, Approach B can be adopted then

### Step-by-Step Plan

#### Step 1: Add `[data-theme="light"]` CSS overrides
**File:** `src/styles.css`
**Action:** Add a `[data-theme="light"]` block after `:root` that swaps all color CSS vars to light values:
```css
[data-theme="light"] {
  --background: 250 250 250;
  --foreground: 9 9 11;
  --card: 244 244 245;
  --card-foreground: 15 15 18;
  --popover: 250 250 250;
  --popover-foreground: 9 9 11;
  --primary: 9 9 11;
  --primary-foreground: 250 250 250;
  --secondary: 228 228 231;
  --secondary-foreground: 15 15 18;
  --muted: 228 228 231;
  --muted-foreground: 113 113 122;
  --accent: 228 228 231;
  --accent-foreground: 9 9 11;
  --destructive: 220 38 38;
  --destructive-foreground: 250 250 250;
  --border: 212 212 216;
  --input: 212 212 216;
  --ring: 9 9 11;
}
```

#### Step 2: Update ScriptOnce to use classList (per TanStack docs)
**File:** `src/routes/__root.tsx:98`
**Current:**
```js
document.documentElement.dataset.theme=r;document.documentElement.style.colorScheme=r
```
**Change to:**
```js
document.documentElement.classList.add(r);document.documentElement.dataset.theme=r;document.documentElement.style.colorScheme=r
```
This ensures the CSS class is applied immediately (before CSS loads), which is the TanStack official pattern.

#### Step 3: Update `syncDomTheme` to toggle classes
**File:** `src/components/ThemeProvider.tsx`
**Current:**
```tsx
root.dataset.theme = mode
root.style.colorScheme = mode
```
**Change to:**
```tsx
root.classList.remove('dark', 'light')
root.classList.add(mode)
root.dataset.theme = mode
root.style.colorScheme = mode
```

#### Step 4: Verify `useEffect` sync reads classList
**File:** `src/components/ThemeProvider.tsx`
**Current:**
```tsx
const domTheme = document.documentElement.dataset.theme
const resolved: ThemeMode = domTheme === 'light' ? 'light' : 'dark'
```
**Keep as-is** — `dataset.theme` is still set by ScriptOnce, this works correctly.

#### Step 5: Build and verify
```powershell
pnpm build
```
Must succeed with zero errors.

#### Step 6: Docker prod test
```powershell
docker build -t personal-website:prod .
docker rm -f personal-website-prod 2>$null
docker run -d --name personal-website-prod -p 3000:3000 personal-website:prod
```
Verify:
1. Hard refresh with DevTools → no visible flash
2. `localStorage.setItem('riyaldi.theme', 'light')` → refresh → page loads light immediately
3. Console: no hydration mismatch warnings
4. All 5 routes render correctly

#### Step 7: Update handoff and blueprint
- Mark `.agent/handoffs/20260331-fouc-hydration-fix.md` as RESOLVED
- Mark blueprint Phase 1 gate as passed
- Update `.agent/CONTEXT.md`

---

## Fallback: If Approach A Still Fails

If CSS class approach still shows a flash, the root cause is CSS load timing — the browser paints before `styles.css` is parsed. In that case, switch to **Approach B (Cookie-based SSR)**:

1. Create `src/lib/theme.ts` with cookie server functions
2. Add `beforeLoad` to `__root.tsx` route
3. Pass theme to `<html className={theme}>`
4. Remove ScriptOnce entirely
5. Server sends correct HTML on first paint — zero flash guaranteed

This is the approach used by Ish Chhabra and Nisab Mohd, and it is the only approach that guarantees zero flash because the server sends the correct HTML before the browser even starts painting.

---

## TL;DR for the executing model

1. Read `.agent/research/fouc-research-solutions.md` for full context
2. Add `[data-theme="light"]` color vars to `src/styles.css`
3. Update ScriptOnce to also do `classList.add(r)` (per TanStack docs official example)
4. Update `syncDomTheme` to toggle `dark`/`light` classes
5. `pnpm build` → must pass
6. Docker prod test → no flash on hard refresh, no hydration warnings
7. Mark handoff resolved, update blueprint
