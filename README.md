# Persona Workshop Builder

A lightweight web workshop for building AI persona prompts in three layers:

- **Quick**: fast prompt generation
- **Deep**: subject/identity calibration
- **Agent**: scenario-mode framework composer

Also includes:
- **Vault Persona** (saved full personas)
- **Draftbook** (editable scratchpad with drag sort)

## Run locally

```bash
cd persona-builder-web
python3 -m http.server 8790
```

Open: `http://localhost:8790`

## Deploy (Vercel)

Internal deployment:

```bash
./scripts/deploy-internal.sh
```

## Project structure

- `index.html` / `quick-*` — Quick layer
- `intuition.html` / `intuition.*` — Deep layer
- `agent.html` / `agent.*` — Agent layer
- `vault*.html` / `vault.*` — Vault + Draftbook
- `assets/` — static assets

## Notes

- This repo is intended as a clean, reviewable app workspace.
- Legacy snapshots are excluded from the public version.
