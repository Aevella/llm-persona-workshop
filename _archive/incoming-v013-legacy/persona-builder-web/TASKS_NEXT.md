# TASKS_NEXT (for next model / collaborator)

## Ground Rules
1. Read this file first, then README/CHANGELOG.
2. Do **not** redesign UI unless explicitly requested.
3. Keep current workflow intact: Quick -> (optional) Deep -> apply back to Quick.
4. Prefer minimal, surgical changes.

## Priority P0
- Add optional LLM mode for Deep:
  - API endpoint contract: `POST /api/deep/generate`
  - Input: quickOutput, q1, q2, q3
  - Output: deepDraft, patches {value, style, brake}, summary
- Keep local fallback when API fails.

## Priority P1
- Add import/export of workspace config:
  - Export current quick/deep state to JSON
  - Import JSON back into fields
- Add tiny compare view:
  - Show key diffs between Quick draft and Deep draft

## Priority P2
- Add tests/checklist automation for release:
  - Generate works
  - Copy buttons work
  - Optional Deep handoff works
  - Mobile layout readable

## Non-goals (for now)
- No major theme rewrite
- No framework migration
- No heavy backend architecture work
