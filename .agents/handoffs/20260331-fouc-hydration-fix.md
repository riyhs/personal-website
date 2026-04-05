# HANDOFF: Remaining FOUC / hydration mismatch
Date: 2026-03-31 | Type: ANALYSIS | Blocking: Y | Status: UNRESOLVED

## Why
The FOUC fix attempt did NOT resolve the issue. After applying all planned changes and verifying in Docker prod mode, the visible flash of unstyled content and hydration mismatch warnings persist in the browser. The build passes cleanly but the runtime behavior is unchanged.

## Actions Taken (did not resolve)

### 1. ScriptOnce — always set `dataset.theme` (both light and dark)
**File:** `src/routes/__root.tsx:98`
**Before:** `if(r==='light')document.documentElement.dataset.theme='light'` (only set for light)
**After:** `document.documentElement.dataset.theme=r` (always set)
**Result:** No change in FOUC behavior. The script runs before hydration but the visual flash still occurs.

### 2. ThemeProvider — defer state sync to useEffect
**File:** `src/components/ThemeProvider.tsx`
**Changes:**
- `useState('dark')` — always starts with `'dark'` to match SSR
- Removed `getInitialTheme()` — no longer reads DOM during hydration render
- Added `useEffect` to sync React state from `document.documentElement.dataset.theme` after hydration
- Added `isFirstRender` ref to skip `syncDomTheme` on mount (avoid redundant DOM writes)
**Result:** No change in FOUC behavior. The flash still happens before React hydrates, meaning the issue is not in React state but in the CSS/script timing.

### 3. Verified `suppressHydrationWarning` on `<html>` and `<body>`
**Result:** Already present, no change needed. Suppresses console warnings but does not fix the visual flash.

## Root Cause Hypothesis (unconfirmed)

The FOUC likely occurs in the gap between:
1. Browser receives SSR HTML (dark theme CSS vars)
2. ScriptOnce executes and applies theme to DOM
3. CSS finishes loading/parsing
4. React hydration begins

Since `styles.css` has NO `[data-theme="light"]` override selectors — only `:root` dark vars — the CSS has no mechanism to actually switch colors based on `dataset.theme`. The `style.colorScheme` property only affects browser UI (scrollbars, form controls), not CSS custom properties. **The CSS itself may need light theme overrides** for the theme switching to work at all, which means the FOUC is not just a timing issue but a missing CSS mechanism.

## What to Try Next

1. **Add light theme CSS overrides** — `[data-theme="light"]` block in `styles.css` that swaps all color CSS vars to light values
2. **Inline critical theme CSS** — put the `:root` + `[data-theme]` vars in a `<style>` tag in `<head>` before CSS load
3. **Verify ScriptOnce executes before first paint** — the script is inside `<body>`, which means the browser may have already painted before it runs. Consider moving it to `<head>` via `head()` in `__root.tsx`
4. **Test with `pnpm dev` + Network throttling** — slow connection makes FOUC more visible and helps identify the timing gap

## Context
- Blueprint phase: 1, task: 1.1-1.4
- Branch/worktree: experiment
- Key files: `src/routes/__root.tsx`, `src/components/ThemeProvider.tsx`, `src/styles.css`

## Prompt (copy-paste to next session)
---
Read AGENTS.md and .agent/CONTEXT.md first.

The FOUC fix from the previous session did NOT work. The root cause is likely that `src/styles.css` has NO `[data-theme="light"]` color overrides — only `:root` dark vars exist. This means `dataset.theme` and `style.colorScheme` have no CSS to act on.

Steps:
1. Add `[data-theme="light"]` block in `src/styles.css` with light color CSS vars
2. Consider inlining critical theme vars in `<head>` via a `<style>` tag so they're available before CSS loads
3. Verify ScriptOnce placement — if it's inside `<body>`, the browser may paint before it runs
4. Test with `pnpm dev` and Docker prod mode — no visible flash on hard refresh

When done: mark this handoff RESOLVED and update blueprint.
---

## What's done / what to protect
- Done: `ScriptOnce` theme bootstrap (sets `dataset.theme` + `style.colorScheme`), `suppressHydrationWarning` on `<html>` and `<body>`, deterministic UTC date formatting, ThemeProvider defers state sync to useEffect.
- Don't touch: route structure, visual layout, TanStack upgrade versions.

## Resolution
Resolved by: — | Date: — | Summary: — | Resume at: Phase 1 FOUC fix — add light theme CSS overrides and inline critical theme CSS
