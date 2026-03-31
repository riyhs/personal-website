# HANDOFF: Remaining FOUC / hydration mismatch
Date: 2026-03-31 | Type: ANALYSIS | Blocking: Y | Status: PENDING

## Why
The original FOUC fix did not fully resolve the runtime issue. The browser still reports hydration mismatch and a visible flash, and the stack trace shows the rendered HTML diverging in `RootDocument` and on blog/date text. The remaining issue appears to be a mix of browser-injected attributes on `<body>` and non-deterministic date formatting across SSR/client, which needs a deeper pass before the fix can be considered complete.

## Context
- Blueprint phase: 1, task: 1.1-1.4
- Branch/worktree: wt/fix-fouc / personal-website-wt-fix-fouc
- Key files: `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/blog.tsx`, `src/routes/blog.$slug.tsx`, `src/components/ThemeProvider.tsx`

## Prompt (copy-paste to next session)
---
Read AGENTS.md and .agent/CONTEXT.md first.

Investigate the remaining FOUC/hydration mismatch in `wt/fix-fouc`. Confirm whether the root cause is browser-added body attributes, SSR/client date formatting, or another mismatch in `RootDocument`/blog routes. Fix the cause without changing the visual design, then verify with Docker prod mode and update the Phase 1 status accordingly.

When done: mark this handoff RESOLVED and write resume point.
---

## What's done / what to protect
- Done: `ScriptOnce` theme bootstrap added, `suppressHydrationWarning` added to `<html>`, deterministic UTC date formatting added for blog lists and blog posts, `suppressHydrationWarning` added to `<body>`.
- Don't touch: route structure, visual layout, TanStack upgrade versions.

## Resolution
Resolved by: — | Date: — | Summary: — | Resume at: Phase 2 SEO implementation after handoff capture
