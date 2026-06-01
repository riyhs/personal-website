# Plan Build Review Workflow

Default flow for this repo: plan first, build second, review before done.

## Session Start

1. Read `AGENTS.md`, `.agents/CONTEXT.md`, `tasks/todo.md`, and `.agents/lessons.md`.
2. Run `git branch --show-current`.
3. Say `Ready. Branch: [branch]. Task: [task].`

## Plan

- Use OpenCode `plan` primary agent for strategy, scope, and tradeoff review.
- No file edits in planning unless user explicitly asks for docs or task updates.
- For larger work, write or update `tasks/todo.md` with concrete steps.
- Capture important decisions in `.agents/CONTEXT.md`.

## Build

- Use OpenCode `build` primary agent for implementation.
- Prefer minimal correct changes.
- Follow code style and project rules in `AGENTS.md`.
- Add or update tests when behavior changes.
- Run the smallest useful verification first, then broader checks when needed.

## Review

- Switch to `reviewer` primary agent after meaningful code changes and before marking work complete.
- Reviewer is read-only and checks codebase rules, security, tests, design consistency, accessibility, and maintainability.
- Fix high and medium severity findings before completion unless user explicitly accepts risk.
- Record unresolved risks in final response and `.agents/CONTEXT.md` when relevant.

## Memory

- `.agents/CONTEXT.md` stores project state, decisions, active work, and next steps.
- `.agents/PREFERENCES.md` stores user workflow and style preferences.
- `.agents/lessons.md` stores corrections and lessons learned.
- `tasks/todo.md` stores active and completed tasks.
- Keep memory files short, current, and factual.

## Agent Policy

- Prefer primary agents: `plan`, `build`, `reviewer`.
- Use subagents only when a narrower read-only pass is enough.

## Completion Gate

- Tests or verification run, or reason clearly stated.
- Reviewer run for non-trivial code changes.
- `tasks/todo.md` updated when task status changes.
- `.agents/CONTEXT.md` updated at session end.
