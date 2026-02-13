# TASKS_NEXT (handoff-ready)

## First Read (for no-memory continuation)
1. Product is now **layered, not linear**:
   - Quick = voice/style layer (怎么说话)
   - Deep = subject skeleton layer (谁在说话)
   - Agent = scenario behavior layer (不同场景怎么做)
   - Story = memory-first extraction lane (planned; home entry exists as coming-soon)
2. Do **not** re-merge mirror framework into Quick templates.
3. Keep optional progression: users can stop at any layer.

## Current Stable UX Rules
- Top sticky mini-nav exists on Quick/Deep/Agent; no step numbering (avoid “forced flow” feeling).
- Theme-linked glow is required:
  - Quick = gold
  - Deep = pink
  - Agent = white
- Agent defaults mode fields empty; examples are explicit opt-in:
  - Full example: `loadPharosCase`
  - Mode-only example: `fillModeExample`
- Export behavior:
  - Quick: export selected output type (Full/Compact/JSON)
  - Agent: export current previewed file only

## Priority P0 (next implementation)
1. Deep LLM channel (optional but primary)
   - Endpoint: `POST /api/deep/generate`
   - Input: quickOutput + q1/q2/q3 (+ lang)
   - Output: summary + payload + patches `{value, style, brake}`
   - Must keep local fallback when API fails/timeouts.
2. Add explicit “fallback mode” copy in Deep UI:
   - LLM recommended / rule fallback (user-visible, non-scary)

## Priority P1
1. Story lane scaffold page (`story.html`) with:
   - Memory input blocks (anniversary/diary/chat snippets)
   - “Extract skeleton” placeholder action
   - clear warning: structured extraction, not literal person restoration
2. Home Story card: switch from disabled to active once page exists.

## Priority P2 (housekeeping)
1. Unify flow-nav styles into shared base + per-page theme vars.
2. Normalize i18n key naming across home/quick/deep/agent.
3. Add lightweight smoke checklist script/docs for:
   - language toggle
   - copy/export
   - handoff (Quick->Deep->Quick, Quick->Agent)
   - mobile viewport checks

## Non-goals (for now)
- No framework migration
- No major backend composer/router rewrite yet
- No forced wizard flow
