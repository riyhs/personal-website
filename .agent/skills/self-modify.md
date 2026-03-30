# SKILL: self-modify
> Triggered by: "update rule / add skill / change how you / APEX should / remember that / always / never"

## Tiers
| Tier | Files | Confirm first? |
|------|-------|---------------|
| 🔴 1 — Constitutional | `AGENTS.md`, `BLUEPRINT.md` | YES — show diff, wait for "yes" |
| 🟡 2 — Operational | `skills/*.md`, `PREFERENCES.md`, `scripts/` | NO — apply directly |
| 🟢 3 — State | `context.md`, `lessons.md`, `failures.md`, `todo.md` | NO — always free to edit |

## Procedure
1. Identify file + tier
2. Backup (Tier 1+2): `cp [file] .agent/backups/[file].[YYYYMMDD-HHmmss]`
3. Tier 1 only: show BEFORE/AFTER diff, wait for explicit "yes"
4. Apply minimal edit — surgical, nothing adjacent
5. Re-read file to verify
6. Report: `✓ [file] updated | [what changed] | rollback: cp .agent/backups/[f] [dest]`

## Adding a new skill
1. Next number: check `.agent/skills/` for highest prefix
2. Create `.agent/skills/[NN]-[name].md` with: trigger phrases, procedure, output
3. Add one line to AGENTS.md TOOL ORDER: `- **[name]** — [trigger] → skills/[file]`

## Rollback
```powershell
Get-ChildItem .agent\backups\ | Sort LastWriteTime -Desc  # list
Copy-Item .agent\backups\[file].[ts] [original-path]       # restore
```
