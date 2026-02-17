# Alignment Status (internal vs public)

Updated: 2026-02-16 00:08 CST

## Policy
See `VARIANT_POLICY.md`.
Default = shared changes sync to both repos.
Approved divergence: `V-001` only.

## Current diff summary
Common files with content differences:
- `home.html` ✅ expected (V-001 Intimacy entry visibility rule)
- `CHANGELOG.md` (needs sync decision)
- `README.md` (needs sync decision)

Internal-only files (expected):
- `intimacy.html`, `intimacy.css`, `intimacy.js`
- `docs/ENGINEERING_GUARD_CHECKLIST.md`
- `docs/HIGH_TOUCH_POLISH.md`
- `docs/INTIMACY_SPEC_V0.1.md`
- `_share/*` packs
- `scripts/deploy-internal.sh`

Public-only files (expected):
- `scripts/deploy-public.sh`

## Next cleanup actions
1. Decide whether to fully sync `README.md` + `CHANGELOG.md` or keep channel-specific notes.
2. Keep `home.html` divergence only for V-001 logic.
3. Run final EN polish pass (Deep/Agent wording consistency), then deploy both variants.
