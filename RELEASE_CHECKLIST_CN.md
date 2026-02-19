# RELEASE_CHECKLIST_CN.md

## Purpose
Pre-release gate for **CN_COMPLIANT** deployment profile.
Use this checklist before any domestic-access release.

## Profile Declaration
- [ ] This release is explicitly marked as `CN_COMPLIANT`.
- [ ] Deploy target/domain is confirmed for domestic access.

## Entry & Navigation Guards
- [ ] Home does **not** expose Intimacy entry.
- [ ] Quick/Deep/Agent/Story pages do not contain direct Intimacy CTA links.
- [ ] Vault/Home cards do not expose intimacy-focused copy in CN mode.

## Capability Guards
- [ ] Explicit / adult-intensity options are disabled or removed in exposed flows.
- [ ] NSFW escalation paths are disabled in CN mode.
- [ ] Any auto-unlock logic that could reveal Intimacy is blocked in CN mode.

## Copy & UI Guards
- [ ] Public visible copy avoids sexualized instruction language.
- [ ] CN naming and app title are correct (`你的提示词`, if enabled for this release).
- [ ] Install/Add-to-home-screen flow tested once in Chinese UI.

## PWA & Caching Guards
- [ ] Manifest points to intended CN profile behavior.
- [ ] Service worker cache is refreshed (verify new `sw.js`/manifest fetched).
- [ ] Old icon/name cache behavior checked on iOS Safari (remove/re-add if needed).

## Verification Pass (Manual)
- [ ] Home → Quick → Deep → Agent → Story path tested in CN mode.
- [ ] Search in built pages for forbidden exposed terms (manual spot-check).
- [ ] No accidental divergence outside approved variant ids (`V-001`, `V-002`).

## Release Notes
- [ ] Changelog includes `CN_COMPLIANT` note and scope.
- [ ] Variant policy reference included (`VARIANT_POLICY.md#V-002`).

## Sign-off
- Product owner (AA): ____________________
- Implement/maintain (Corveil): ____________________
- Date: ____________________
