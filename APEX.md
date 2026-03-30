# APEX — Agent Project EXecution
Lightweight multi-agent workflow for OpenCode Desktop (Windows).

## Structure
```
your-project/
├── AGENTS.md               ← agent constitution (OpenCode reads this automatically)
├── .agent/
│   ├── CONTEXT.md          ← session memory
│   ├── PREFERENCES.md      ← your style/workflow preferences
│   ├── lessons.md          ← self-improvement log
│   ├── failures.md         ← escalation queue
│   ├── BLUEPRINT.md        ← full project roadmap (written at kickoff)
│   ├── skills/             ← kickoff / execute / handoff / modify
│   ├── handoffs/           ← async handoff files + INDEX.md
│   └── backups/            ← auto-created before any APEX file is modified
├── tasks/todo.md           ← current task board
└── scripts/                ← wt-new / wt-done / wt-list
```

## Setup
```powershell
# From your project root:
.\bootstrap.ps1
```
Then fill in `.agent/CONTEXT.md` and `.agent/PREFERENCES.md`.

## Git
```gitignore
.agent/backups/        # ← ignore (temp)
.agent/worktrees.json  # ← ignore (machine-local paths)
# everything else → commit
```
Commit `AGENT.md`, `BLUEPRINT.md`, `skills/`, `lessons.md`, `handoffs/` — they compound in value over the project lifetime.

## Workflow
| Session | Start message |
|---------|--------------|
| New project | `[KICKOFF] I want to build: [description]` |
| Implement | `[IMPL] Read AGENTS.md then execute tasks/todo.md` |
| Fix failures | Open `.agent/handoffs/[file].md`, copy prompt, paste into session |

## Worktrees
```powershell
.\scripts\wt-new.ps1 -name feature-name   # create
.\scripts\wt-list.ps1                      # list
.\scripts\wt-done.ps1 -name feature-name  # merge + cleanup
```

## Model control
Agent flags handoffs — you decide which model handles them. No model is prescribed.
