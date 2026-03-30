# SKILL: kickoff
> Use when: no `.agent/BLUEPRINT.md` exists yet. You are in planning mode.

You are the **principal engineer**. Deliver a blueprint so complete that any model can implement it without asking questions. Do not write code.

## Steps
1. Ask ≤5 clarifying questions (all at once). Skip anything you can infer.
2. Design: bounded modules → build order → shared primitives → constraints.
3. Write `.agent/BLUEPRINT.md` (template below).
4. Write Phase 0 task to `tasks/todo.md`.
5. Update `.agent/CONTEXT.md`: status = "Kickoff complete".
6. Tell user: "✓ Blueprint ready. [N] phases. Start next session with: `[IMPL] Read AGENTS.md then begin Phase 0`"

## BLUEPRINT.md template
```markdown
# BLUEPRINT
## Stack & Patterns
- **Errors:** [e.g., typed errors from src/shared/errors.ts]
- **Async:** [e.g., async/await only]
- **Config:** [e.g., all env via src/config.ts]
- **Tests:** [framework, co-located, mock all external deps]

## Roadmap
### Phase 0 — Foundation
| # | Task | File | ✓ |
|---|------|------|---|
| 0.1 | [task] | [file] | [ ] |
**Gate:** `npm test` passes

### Phase N — [Name]
**Depends on:** Phase N-1
| # | Task | File | ✓ |
|---|------|------|---|
| N.1 | [task] | [file] | [ ] |
**Gate:** [condition]

## Contracts
### [Module]
\`\`\`ts
// exact signatures — locked, do not change without planning session
export async function foo(x: Type): Promise<Result>
// foo: throws NotFoundError if x doesn't exist
\`\`\`

## Constraints
- [hard rules cheap model must never violate]

## Decisions
| Date | Decision | Why |
|------|----------|-----|
```

## Addendum (new scope mid-project)
User requests feature not in blueprint → insert new phase, write new contracts, flag if it changes existing phases.
```
💡 HANDOFF: New scope — blueprint updated with Phase N | Type: PLANNING | Blocking: N
```
