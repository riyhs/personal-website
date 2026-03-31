# FOUC Research — All Solutions Found

**Date:** 2026-03-31 | **Sources:** Web search + TanStack official docs + community articles

---

## Source 1: TanStack Official Docs — ScriptOnce (Document Head Management)
**URL:** https://tanstack.com/router/latest/docs/guide/document-head-management

### Key Points
- `ScriptOnce` is the official TanStack primitive for scripts that must run before hydration
- During SSR, renders a `<script>` tag that executes immediately when browser parses HTML
- After execution, the script removes itself from the DOM
- On client-side navigation, nothing is rendered (prevents duplicate execution)
- **Official example uses `classList.add(resolved)`** — NOT `style.colorScheme`:
  ```js
  document.documentElement.classList.add(resolved)
  ```
- **Must use `suppressHydrationWarning` on `<html>`** if script modifies DOM before hydration
- ScriptOnce can be placed inside `<body>` and still modify `<html>`

---

## Source 2: Leonardo Montini — "TanStack Start: light, dark, and system theme without flickers"
**URL:** https://leonardomontini.dev/tanstack-start-theme | **Date:** Aug 2025

### Key Points
- **Distinguishes `UserTheme` ('light'|'dark'|'system') from `AppTheme` ('light'|'dark')**
- Uses `classList.add('light'/'dark'/'system')` on `<html>` — NOT `style.colorScheme`
- **ScriptOnce must set the class before hydration** — the inline script is the ONLY thing that prevents FOUC
- **Rule #2: Let CSS drive toggle UI visibility** — don't rely on React state for initial render, use CSS selectors based on root classes
- Uses Tailwind class selectors: `not-system:light:inline`, `system:inline`
- Recommends `createIsomorphicFn` and `clientOnly` from TanStack Start for SSR-safe helpers
- **localStorage approach requires CSS tricks for initial render** — server has no knowledge of preference
- **Cookie approach makes server aware of theme** — but adds network round-trips
- Demo repo: https://github.com/Balastrong/start-theme-demo

### themeScript from this source:
```js
(function () {
  function themeFn() {
    try {
      const storedTheme = localStorage.getItem('ui-theme') || 'system';
      const validTheme = ['light', 'dark', 'system'].includes(storedTheme) ? storedTheme : 'system';
      if (validTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(systemTheme, 'system');
      } else {
        document.documentElement.classList.add(validTheme);
      }
    } catch (e) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme, 'system');
    }
  }
  return `(${themeFn.toString()})();`;
})();
```

---

## Source 3: Ish Chhabra — "How to add theming to an SSR app (TanStack Start)"
**URL:** https://www.ishchhabra.com/writing/ssr-theming | **Date:** Mar 2026

### Key Points
- **localStorage approach ALWAYS flashes** — server sends default theme before JS runs
- **Cookie approach eliminates flash** — server reads cookie before rendering, applies correct class on `<html>`
- Uses `createServerFn` + `getCookie`/`setCookie` from `@tanstack/react-start/server`
- **Toggle slowness fix:** Use `useOptimistic` for instant UI feedback, then server write in background
- **Navigation slowness fix:** Client-side cache for theme — `beforeLoad` checks `typeof window` and returns cached value on client
- **Full flow:** Server reads cookie → applies class on `<html>` → client caches theme → navigations are instant
- No ScriptOnce needed when using cookie approach — SSR already sends correct HTML

### Cookie approach code pattern:
```tsx
// __root.tsx
beforeLoad: async () => {
  if (typeof window === "undefined") {
    return { theme: await getThemeServerFn() };
  }
  return { theme: getThemeForClientNav() };
},

// In RootDocument
<html className={theme} suppressHydrationWarning>
```

---

## Source 4: Dennis Kinuthia — "TanStack Start SSR-Friendly Theme Provider"
**URL:** https://dev.to/tigawanna/tanstack-start-ssr-friendly-theme-provider-5gee | **Date:** Jul 2025

### Key Points
- Uses `FunctionOnce` wrapper around `ScriptOnce` for type-safe function-to-string conversion
- **Uses `classList.add('dark'/'light')`** on `<html>`
- `ThemeProvider` wraps `FunctionOnce` + children
- System preference detection via `matchMedia` listener in `useEffect`
- **`suppressHydrationWarning` on `<html>`** prevents dev warnings

---

## Source 5: Nisab Mohd — "Implement Dark Mode in TanStack Start"
**URL:** https://nisabmohd.vercel.app/tanstack-dark | **Date:** Apr 2025

### Key Points
- **Cookie-based approach** — stores theme in cookie, reads in `loader()` on `__root.tsx`
- **Applies class directly on `<html>`**: `<html className={theme}>`
- No ScriptOnce needed — SSR sends correct HTML from the start
- `ThemeProvider` receives initial theme from `Route.useLoaderData()`
- `setTheme` calls server function to update cookie + `router.invalidate()`

---

## Source 6: GitHub Issue #2589 — Mantine FOUC
**URL:** https://github.com/TanStack/router/issues/2589 | **Date:** Oct 2024

### Key Points
- Mantine's `ColorSchemeScript` must be in `<head>`, not `<body>` — causes hydration mismatch if placed wrong
- If `ColorSchemeScript` is commented out, console warnings go away but FOUC remains
- **Key insight:** Scripts that modify DOM before hydration MUST be in `<head>` to run before first paint

---

## Source 7: Josef Bender — "Dark Mode in TanStack Start (No Flicker + TailwindCSS)" (YouTube)
**URL:** https://www.youtube.com/watch?v=h8QJ-keNnHw | **Date:** Feb 2026

### Key Points
- Uses TailwindCSS `dark:` modifier with class-based strategy
- ScriptOnce sets `class="dark"` on `<html>` before hydration

---

## Common Patterns Across ALL Sources

| Approach | ScriptOnce? | CSS Mechanism | SSR Aware | FOUC Free? |
|----------|-------------|---------------|-----------|------------|
| **localStorage + ScriptOnce + classList** | Yes | `classList.add('dark'/'light')` | No | Yes (if CSS has class selectors) |
| **Cookie + loader() + className on html** | No | `className={theme}` on `<html>` | Yes | Yes |
| **Cookie + ScriptOnce + classList** | Yes | `classList.add()` | Yes | Yes |
| **Our current: localStorage + ScriptOnce + style.colorScheme** | Yes | `style.colorScheme` + `dataset.theme` | No | **NO** — CSS has no selectors for these |

---

## Critical Finding: Why Our Current Approach Fails

**Our `styles.css` has NO `[data-theme="light"]` or `.light`/`.dark` color overrides.** Only `:root` dark vars exist. This means:
1. `style.colorScheme` only affects browser UI (scrollbars, form controls) — NOT CSS custom properties
2. `dataset.theme` has no CSS selectors to act on
3. ScriptOnce sets DOM state correctly, but CSS never changes because there are no theme-specific CSS rules
4. The "flash" is actually the page always rendering dark (the only theme that exists in CSS), regardless of user preference

**To fix FOUC, we need EITHER:**
- A) Add `[data-theme="light"]` or `.light`/`.dark` CSS overrides with light color vars
- B) Switch to cookie-based SSR approach (server reads cookie, sends correct HTML)
