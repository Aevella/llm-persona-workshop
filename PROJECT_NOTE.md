# PROJECT_NOTE

## What this is

`vibeprompt` is a living playground for composing persona prompts and interaction modules.

Primary goal: **make ideas tangible fast** (tweak → preview → export/share).

Secondary goal: keep enough structure so collaboration handoff is easy (AA / Corveil / Claude).

---

## What we are doing now

Current mode is **light organization** (not architecture rewrite):

1. Keep existing flows stable and playable
2. Normalize naming and module boundaries gradually
3. Record decisions so future edits stay coherent

---

## Module map (current)

- Quick layer
  - `index.html`
  - `quick-main.js`, `quick-ui.js`, `quick-engine.js`, `quick-i18n.js`
  - `quick-main.css`

- Intuition / Deep layer
  - `intuition.html`, `intuition.js`, `intuition.css`

- Agent layer
  - `agent.html`, `agent.js`, `agent.css`

- Intimacy layer
  - `intimacy.html`, `intimacy.js`, `intimacy.css`

- Story layer
  - `story.html`, `story.js`, `story.css`

- Shared helpers
  - `shared-utils.js`

- Vault/Draftbook
  - `vault*.html`, `vault.js`, `vault.css`

---

## Naming baseline

- Page entry: `<module>.html`
- Logic: `<module>.js`
- Styles: `<module>.css`
- Shared infra: `shared-*` or `<domain>-engine` / `<domain>-ui`

If a new feature spans multiple modules, prefer `shared-*` utilities over copy-paste.

---

## Non-goals (for now)

- No bundler migration as mandatory step
- No deep folder nesting that slows direct editing
- No large-scale rewrite only for aesthetics

---

## Next 3 practical upgrades

1. Add preset import/export (URL + JSON) for quick/shareable states
2. Add per-module "copy output" actions (prompt/css/json)
3. Add a tiny smoke checklist before push (open core pages + basic interactions)
