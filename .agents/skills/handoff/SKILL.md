# SKILL: handoff
> Use when: flagging a task that needs different capability. You package it; user picks the model.

## Triggers
| Condition | Type | Blocking |
|-----------|------|---------|
| 2 failed fix attempts | ANALYSIS | YES |
| Architecture / design decision needed | PLANNING | NO |
| New feature not in blueprint | PLANNING | NO |
| Next tasks are pure boilerplate | EXECUTION | NO |
| No blueprint yet | PLANNING | YES |

## File: `.agent/handoffs/YYYYMMDD-slug.md`
```markdown
# HANDOFF: [title]
Date: [DATE] | Type: [PLANNING/ANALYSIS/EXECUTION] | Blocking: [Y/N] | Status: PENDING

## Why
[One paragraph: what you hit, why it needs different capability]

## Context
- Blueprint phase: [N], task: [N.X]
- Branch/worktree: [X]
- Key files: [list]

## Prompt (copy-paste to next session)
---
Read AGENTS.md and .agent/CONTEXT.md first.

[Exact task. Be specific: files, functions, constraints, expected output.]

When done: mark this handoff RESOLVED and write resume point.
---

## What's done / what to protect
- Done: [list]
- Don't touch: [list]

## Resolution
Resolved by: — | Date: — | Summary: — | Resume at: —
```

## After writing
1. Append to `.agent/handoffs/INDEX.md`: `| [DATE] | [slug] | [type] | PENDING | [Y/N] |`
2. Show flag in chat (see AGENTS.md format)
3. If non-blocking: keep working on next available task
