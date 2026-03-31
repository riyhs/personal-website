# TASK: Phase 1 — Fix FOUC (Flash of Unstyled Content)

## Context
Worktree: `D:\Dev\Projects\Website\18_riyaldi.com\tanstack\personal-website-wt-upgrade-seo-fouc`
The site has a visible flash of unstyled content on page load because the theme (dark mode) is applied client-side via React state, causing a brief flash before hydration.

## Root Cause
`ThemeProvider.tsx` uses `useState(() => getInitialTheme())` which only runs client-side. During SSR, it defaults to `'dark'`, but the DOM class/attribute isn't set until `useEffect` fires after hydration.

## Solution
Use TanStack Router's `ScriptOnce` to inject a blocking script that applies the theme before React hydrates.

## Steps

### 1.1 — Edit `src/routes/__root.tsx`

Add `ScriptOnce` import and theme detection script. Here are the exact changes:

**Add import:**
```tsx
import { ScriptOnce } from '@tanstack/react-router'
```
(Add to the existing import block from `@tanstack/react-router`)

**Add `suppressHydrationWarning` to `<html>` tag:**
```tsx
<html lang="en" suppressHydrationWarning>
```

**Add ScriptOnce inside `<body>`, before `<ThemeProvider>`:**
```tsx
<body>
  <ScriptOnce children={`(function(){try{var t=localStorage.getItem('riyaldi.theme')||'dark';var r=t==='auto'?(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):t;document.documentElement.style.colorScheme=r;if(r==='light')document.documentElement.dataset.theme='light'}catch(e){}})()`} />
  <ThemeProvider>
```

**Key details:**
- Storage key is `riyaldi.theme` (matches `ThemeProvider.tsx` STORAGE_KEY)
- Default to `'dark'` if nothing stored (matches current behavior)
- Sets `colorScheme` and `data-theme` attribute (matches `syncDomTheme` in ThemeProvider)
- ScriptOnce runs during SSR, executes before hydration, then self-removes

### 1.2 — Update `src/components/ThemeProvider.tsx`

The `getInitialTheme()` function should also read from the DOM if a class/attribute was already set by ScriptOnce. Change `getInitialTheme`:

```tsx
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  // Check if ScriptOnce already set the theme via data-theme attribute
  const domTheme = document.documentElement.dataset.theme
  if (domTheme === 'light') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }

  return 'dark'
}
```

### 1.3 — Verify no FOUC

```powershell
pnpm dev
```
1. Open http://localhost:3000 in incognito
2. Hard refresh (Ctrl+Shift+R)
3. Should see dark theme immediately, no white flash

### 1.4 — Commit
```powershell
git add .; git commit -m "fix: eliminate FOUC with ScriptOnce theme detection"
```

## Success criteria
- No visible white flash on page load
- Theme persists across refreshes
- `pnpm build:only` still passes
- No React hydration warnings in console
