# OWNERSHIP_MAP (Public)

## Public-only (must stay here)
- `manifest.webmanifest`
- `manifest.en.webmanifest`
- `manifest.zh.webmanifest`
- `sw.js`
- `sw-register.js`
- `scripts/release-bump.sh`
- `scripts/deploy-public.sh`
- `RELEASE_CHECKLIST_CN.md`
- Public PWA icons/assets under `assets/` (e.g., `icon-*.png`, `pwa-icon.png`)

## Shared core (intake from beta)
- UI/app pages: `index.html`, `home.html`, `intuition.*`, `agent.*`, `story.*`, `vault.*`
- Quick layer: `quick-*.js`, `quick-main.css`
- Shared logic: `shared-utils.js`
- Common docs: `CHANGELOG.md`, `GUARDRAILS.md`, `VARIANT_POLICY.md`

## Blocklist from beta
- `PROJECT_NOTE.md`
- `SMOKE_CHECKLIST.md`
- `_share/`
- Internal docs in `docs/` not intended for public release
