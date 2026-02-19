# VARIANT (Public)

## Channel
- `public`

## Role
This repository is the **public release** track and current primary development baseline.

## Sibling variant
- `../persona-builder-web` (beta/internal workspace)

## Intent
- Keep public-safe, stable UX and conservative copy/behavior
- Exclude internal-only notes and experimental materials

## Sync direction (current policy)
- Intake from beta should be curated and reviewed
- Prefer small batches and explicit review
- Reverse sync only when needed for controlled baseline alignment

## Public-only assets (source of truth here)
- `manifest.webmanifest`
- `manifest.en.webmanifest`
- `manifest.zh.webmanifest`
- `sw.js`
- `sw-register.js`
- `scripts/release-bump.sh`
- `scripts/deploy-public.sh`
- `scripts/release-public.sh`
- `RELEASE_CHECKLIST_CN.md`
- PWA icons/assets in `assets/` (e.g. `icon-*.png`, `pwa-icon.png`)

## Shared core (curated intake)
- UI/pages: `index.html`, `home.html`, `intuition.*`, `agent.*`, `story.*`, `vault.*`
- Quick layer: `quick-*.js`, `quick-main.css`
- Shared logic: `shared-utils.js`
- Core docs: `CHANGELOG.md`, `GUARDRAILS.md`, `VARIANT_POLICY.md`

## Blocklist (must not enter public)
- `PROJECT_NOTE.md`
- `SMOKE_CHECKLIST.md`
- `_share/`
- Internal docs not intended for release

## Release gate
1. `./scripts/check-variant-boundary.sh`
2. `./scripts/release-public.sh patch|minor|major`
3. Commit + push
4. `./scripts/deploy-public.sh`
