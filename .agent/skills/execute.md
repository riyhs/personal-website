# SKILL: execute
> Use when: BLUEPRINT.md exists. You are implementing phases.

## Loop
```
1. Read BLUEPRINT.md → find first [ ] task
2. Read its contract (BLUEPRINT.md §Contracts)
3. TDD: write test → run (red) → implement → run (green)
4. Mark [x] in BLUEPRINT.md
5. Commit: git add .; git commit -m "feat(phase-N): task X.Y"
6. Next task
```

## Phase complete
Run phase gate → if passes: update CONTEXT.md, create next phase worktree automatically.
If gate fails after 2 attempts → write to `failures.md` + handoff, move on.

## Contract rule
Implement exactly what the contract specifies. Wrong signature / return type / error behavior = write a handoff, don't improvise.

## Session end
Update `.agent/CONTEXT.md`:
```
Stopped at: Phase N, Task N.X
Completed: [list]
Blockers: [list or none]
```
