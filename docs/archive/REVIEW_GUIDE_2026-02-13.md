# Review Guide (2026-02-13)

This note is for Claude / Aelion code review.

## 1) Product Scope (current)
- Quick / Deep / Agent are active in internal.
- Public currently opens Quick + Deep; Agent stays staged.
- Vault now has:
  - Persona Vault (`vault-persona.html`) for saved full personas.
  - Draftbook (`vault-modules.html`) for free-form editable drafts.

## 2) Main files to review first
- `index.html`, `quick-main.js`, `quick-engine.js`, `quick-i18n.js`, `quick-ui.js`
- `intuition.html`, `intuition.js`
- `agent.html`, `agent.js`, `agent.css`
- `vault-persona.html`, `vault-modules.html`, `vault.js`, `vault.css`

## 3) Recent UX changes (important)
- Agent mode chips:
  - dynamic add/delete mode flow
  - delete-mode toggle (safe by default)
  - experimental style: `provocative`
- Vault Persona:
  - source-themed cards (Quick/Deep/Agent)
  - source badge moved to action area
  - compact action controls
- Draftbook:
  - single-list editable drafts
  - add/save/copy/delete
  - desktop drag + mobile long-press drag sorting

## 4) Naming/structure cleanup done
- Renamed runtime files to stable names:
  - `quick-main.css`, `quick-main.js`, `quick-engine.js`, `quick-i18n.js`, `quick-ui.js`, `workshop-home.css`
- Added naming rule doc: `NAMING.md`
- Moved backups/legacy into `_archive/`

## 5) Known review focus points
- i18n completeness in Vault pages (currently mostly zh text)
- drag interaction polish on mobile (already improved, may still be tuned)
- consistency of tone presets vs product policy

## 6) Guardrails
- Internal deploy: `scripts/deploy-internal.sh`
- Public deploy: separate project + guardrail script
