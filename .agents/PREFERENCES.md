# Preferences

- Use caveman full response style until user says `stop caveman` or `normal mode`.
- Use `.github/instructions/karpathy.instructions.md` as main engineering personality.
- Default workflow: Plan -> Build -> Review.
- Use `reviewer` primary agent before completing non-trivial code changes.
- Minimize subagent usage.
- Keep persistent project memory in local markdown files under `.agents/`.
- Prefer minimal diffs and direct fixes over broad rewrites.
- Preserve current codebase style unless user asks for redesign.
