# TASK: Phase Final — Verification & Cleanup

## Context
Worktree: `D:\Dev\Projects\Website\18_riyaldi.com\tanstack\personal-website-wt-upgrade-seo-fouc`
Run after Phase 0, 1, and 2 are complete.

## Steps

### F.1 — Full build
```powershell
pnpm build
```
Must exit 0 (includes sitemap generation).

### F.2 — Type check
```powershell
pnpm tsc --noEmit
```
Must exit 0 with no errors.

### F.3 — Verify SSR output
```powershell
pnpm serve
```
Check HTML source of `/` for:
- [ ] `<title>` contains "Riyaldi"
- [ ] `<meta property="og:url">` present
- [ ] `<meta property="og:image">` has absolute URL
- [ ] `<script type="application/ld+json">` present
- [ ] `<link rel="canonical">` present
- [ ] No visible FOUC on hard refresh
- [ ] ScriptOnce theme script present in body

### F.4 — Update .agent/CONTEXT.md

Replace the file content with:
```markdown
# CONTEXT
> Agent: read at session start, update at session end.

## Project
**Name:** personal-website | **Stack:** TanStack Start + React 19 + Tailwind v4 | **Repo:** riyaldi.dev

## State
**Status:** Phase Final complete
**Branch:** wt/upgrade-seo-fouc | **Worktree:** personal-website-wt-upgrade-seo-fouc
**Last completed:** Phase 2 — SEO optimization
**In progress:** Merge back to experiment
**Next:** Merge wt/upgrade-seo-fouc → experiment, then deploy

## Blockers
_none_

## Active worktrees
| Name | Path | Status |
|------|------|--------|
| main | ./ | stable |
| upgrade-seo-fouc | ../personal-website-wt-upgrade-seo-fouc | in progress |

## Key decisions
| Date | Decision | Why |
|------|----------|-----|
| 2026-03-31 | TanStack-only upgrade (not all 27 deps) | Minimize risk |
| 2026-03-31 | ScriptOnce for FOUC | Official TanStack approach per docs |
| 2026-03-31 | JSON-LD for SEO | Google rich results |
| 2026-03-31 | Per-route meta tags | Each page needs unique title/description for Google |

---
_Updated: 2026-03-31_
```

### F.5 — Update tasks/todo.md
Mark all phases as done.

### F.6 — Final commit
```powershell
git add .; git commit -m "chore: update CONTEXT and mark tasks complete"
```

## Merge instructions (for user)
When ready to merge:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/wt-done.ps1 -name upgrade-seo-fouc
```
Or manually:
```powershell
git checkout experiment
git merge wt/upgrade-seo-fouc
git worktree remove ../personal-website-wt-upgrade-seo-fouc
git branch -d wt/upgrade-seo-fouc
```
