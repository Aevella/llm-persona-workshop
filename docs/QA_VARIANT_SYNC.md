# QA Variant Sync Checklist

Goal: keep internal/public aligned except documented variant differences.

## Scope
- Shared by default (V-000)
- Allowed divergence only: V-001 (Home Intimacy entry visibility)

## Quick checks before release
1. Open `home.html` in both variants
   - Internal: Intimacy entry visible by default
   - Public: Intimacy entry hidden until unlock condition met
2. Run Quick save flow in both variants
   - Persona saves successfully
   - Meta fields (`nsfw`, `bodyOn`) persist in `pb_persona_library_v1`
3. Unlock behavior
   - Public: first unlock shows secondary toast
   - Public Home shows unlock note when unlocked
4. Route integrity
   - `intimacy.html` exists and opens in both variants
5. No accidental divergence
   - Diff key shared files (`quick-main.js`, `quick-ui.js`, `shared-utils.js`, `intimacy.*`)
   - Any non-V-001 differences must be synced or documented first

## Suggested commands
```bash
# from workspace
# compare key files quickly
for f in shared-utils.js quick-main.js quick-ui.js intimacy.html intimacy.css intimacy.js; do
  diff -q persona-builder-web/$f persona-builder-web-public/$f || true
done
```
