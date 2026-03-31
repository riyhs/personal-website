# SKILL: modify
> Use when: user asks to change APEX rules, skills, or preferences.

## File tiers
| Tier | Files | Confirmation needed |
|------|-------|-------------------|
| 🔴 Constitutional | `AGENTS.md`, `BLUEPRINT.md` | YES — show diff, wait for "yes" |
| 🟡 Operational | `skills/*.md`, `PREFERENCES.md`, `scripts/` | Only if user didn't explicitly ask |
| 🟢 State | `CONTEXT.md`, `lessons.md`, `failures.md`, `todo.md` | Never |

## Procedure
1. Identify file + tier
2. Backup Tier 🔴🟡: `cp <file> .agent/backups/<file>.<timestamp>`
3. Tier 🔴: show diff → wait for "yes" → apply
4. Tier 🟡🟢: apply immediately
5. Make surgical edit only — nothing outside request scope
6. Report: `✓ Modified [file] | Changed: [what] | Effect: [what changes] | Rollback: cp .agent/backups/[x] [dest]`

## Adding a new skill
- Next number: `ls .agent/skills/` → increment
- File: `.agent/skills/[name].md` (no number prefix needed, name is enough)
- Add row to AGENTS.md skills index
- Confirm trigger phrase to user

## Triggers (recognize these without being asked to run this skill)
"update the rule", "change how you", "add a skill", "I always want", "stop doing X", "APEX should", "remember that"
