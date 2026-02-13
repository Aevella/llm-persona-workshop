# Deploy Guardrail (INTERNAL)

This repository is **INTERNAL** development track.

## Allowed target
- Vercel project: `persona-builder-web`
- Main alias: `https://persona-builder-web.vercel.app`

## Never do from this repo
- Do NOT deploy to `persona-builder-web-public`

## Safe deploy
Use:
```bash
./scripts/deploy-internal.sh
```

This script validates `.vercel/project.json` contains `persona-builder-web` before deploying.
If mismatch is detected, deployment is blocked.
