# Persona Workshop Builder (Public)

Channel: **public release**  
Beta sibling: `../persona-builder-web`

A lightweight web workshop for building AI persona prompts in three layers:

- **Quick**: fast prompt generation
- **Deep**: subject/identity calibration
- **Agent**: scenario-mode framework composer

Also includes:
- **Vault Persona** (saved full personas)
- **Draftbook** (editable scratchpad with drag sort)

## Run locally

```bash
cd persona-builder-web-public
python3 -m http.server 8790
```

Open: `http://localhost:8790`

## Deploy (Vercel)

Release flow:

```bash
./scripts/release-public.sh patch
```

(Equivalent manual steps: `check-variant-boundary` -> `release-bump` -> commit/push -> `deploy-public`)

## Project structure

- `index.html` / `quick-*` — Quick layer
- `intuition.html` / `intuition.*` — Deep layer
- `agent.html` / `agent.*` — Agent layer
- `vault*.html` / `vault.*` — Vault + Draftbook
- `assets/` — static assets

## Notes

- This repo is intended as a clean, reviewable app workspace.
- Legacy records/checklists are archived under `docs/archive/`.
