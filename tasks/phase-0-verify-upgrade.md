# TASK: Phase 0 — Verify TanStack Upgrade

## Context
@tanstack/* packages were upgraded from 1.139.3 to 1.167.14+ in worktree `wt/upgrade-seo-fouc`.
Worktree path: `D:\Dev\Projects\Website\18_riyaldi.com\tanstack\personal-website-wt-upgrade-seo-fouc`

ALL commands must run in the worktree path above.

## Steps

### 0.1 — Verify build compiles
```powershell
pnpm build:only
```
If it fails, read the error and fix. Common issues:
- Import paths changed (check `@tanstack/react-start` exports)
- `shellComponent` → check if API renamed (it was `shellComponent` in 1.139, may now be different)
- `head()` signature may have changed

### 0.2 — Check vite.config.ts imports still valid
Read `vite.config.ts`. Verify these imports resolve:
- `@tanstack/devtools-vite` (was 0.3.11, now 0.6.0)
- `@tanstack/react-start/plugin/vite`
- `@tanstack/router-plugin/vite`
- `nitro/vite`

If any import fails, check the package's export map with:
```powershell
node -e "console.log(Object.keys(require('@tanstack/devtools-vite/package.json').exports || {}))"
```

### 0.3 — Verify route tree regenerates
```powershell
pnpm exec tsr generate
```
Check `src/routeTree.gen.ts` has no errors.

### 0.4 — Type check
```powershell
pnpm tsc --noEmit
```
Fix any type errors. Common after upgrade:
- `head()` return type may require `scripts` array instead of putting scripts in `meta`
- `loaderData` typing may be stricter

### 0.5 — Smoke test dev server
```powershell
pnpm dev
```
Open http://localhost:3000 and verify all 5 routes load:
- `/` (home)
- `/about`
- `/blog`
- `/blog/hello-world`
- `/projects`

### 0.6 — Commit if green
```powershell
git add .; git commit -m "chore: upgrade @tanstack/* packages to latest"
```

## Success criteria
- `pnpm build:only` exits 0
- `pnpm tsc --noEmit` exits 0
- All 5 routes render in dev server
