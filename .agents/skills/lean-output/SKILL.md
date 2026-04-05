# SKILL: lean-output
> Always active. Governs how the agent communicates.

## Default response mode: PATCH ONLY
Never regenerate a full file. Always output the minimal change.

### For file edits — output this format only:
```
FILE: path/to/file.md
ACTION: ADD | REPLACE | REMOVE
LOCATION: [after line "...", under section "##X", at end]

<<<
[old text, 1-5 lines max, only if REPLACE/REMOVE]
>>>
[new text]
```

### For new files — output template only:
```
NEW FILE: path/to/file.md
---
[content]
---
```

### For shell commands — one block, copy-pasteable:
```powershell
[exact commands, no explanation before]
```
Explain AFTER if needed, not before.

## What to NEVER output
- Full file regenerations when only a section changed
- "Here's the updated X:" followed by entire file
- Step-by-step narration of what you're about to do
- Confirmation of things the user can see themselves

## What to ALWAYS output
- The patch/diff/command — lead with it
- One-line reason if non-obvious
- What to do next (if anything)

## Response length rule
If the user's ask can be answered in <5 lines: answer in <5 lines.
If it's a patch: show the patch, nothing else.
If it's a decision/analysis: bullet points, max 10.
