# BLUEPRINT
> TOP model writes once. All models execute from this. Never modify without user instruction.

## PROJECT
**Name:** [name] | **Type:** [web/api/cli/lib] | **Stack:** [stack]
**Goal:** [what done looks like in 1-2 sentences]

## ARCHITECTURE
```
[ASCII system diagram or layer description]
```
**Patterns (locked — never deviate):**
- Errors: [e.g., typed errors from `src/shared/errors.ts`]
- Async: [e.g., async/await only]
- Config: [e.g., all env via `src/config.ts`]
- Tests: [e.g., Vitest, co-located, no real I/O in unit tests]

## ROADMAP
Phases run top-to-bottom. Gate must pass before next phase starts.

### PHASE 0 — Foundation
**Worktree:** main | **Gate:** `npm run build && npm test` clean
| # | Task | File(s) | ✓ |
|---|------|---------|---|
| 0.1 | [task] | [file] | [ ] |

### PHASE 1 — [Name]
**Worktree:** `wt/phase-1` | **Gate:** all phase tests pass
| # | Task | File(s) | ✓ |
|---|------|---------|---|
| 1.1 | Write tests for [X] | `src/[m]/[m].test.ts` | [ ] |
| 1.2 | Implement [X] | `src/[m]/[m].ts` | [ ] |

### PHASE N — [Name]
<!-- repeat pattern -->

### PHASE FINAL — Integration
**Worktree:** `wt/final` | **Gate:** full suite green + manual smoke
| # | Task | File(s) | ✓ |
|---|------|---------|---|
| F.1 | Integration tests | `tests/integration/` | [ ] |
| F.2 | Error/config audit | all | [ ] |
| F.3 | README | `README.md` | [ ] |

## CONTRACTS
> Exact signatures. Implementing model must not deviate.

### [Module]
```typescript
// src/[module]/[module].ts
export async function fnName(param: Type): Promise<ReturnType>
// errors: [when to throw what]
// types needed in src/shared/types.ts: [list]
```

## CONSTRAINTS
- [e.g., DB pool max 10 — never create connections outside `db.ts`]
- [e.g., all dates UTC in DB, local only at API boundary]

## DECISIONS
| Date | Decision | Why |
|------|----------|-----|
| [date] | [what] | [why] |

## HANDOFF CONDITIONS
Flag `[NEEDS-HANDOFF]` and write to `.agent/handoffs/` when:
- New feature not in this roadmap
- Contract signature must change
- Phase gate fails and unfixable in 2 attempts
