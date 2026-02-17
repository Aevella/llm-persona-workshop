# VARIANT_POLICY.md

## Purpose
Keep **internal** and **public** versions aligned by default.
Only explicitly approved differences may diverge.

## Default Rule
- If a change is not listed in this file, it is treated as a **shared change** and must be synced to both variants.
- Any new variant difference must be documented here **before** implementation.
- Baseline principle: **internal and public stay identical by default**.

### V-000 Baseline Alignment (global)
- **What**
  - Internal/Public behavior and code should stay unified across all pages and modules by default.
- **Exception rule**
  - Only documented variant ids may diverge.
  - Current intentional divergence: **V-001 Intimacy entry visibility on Home**.
- **Release gate**
  - Before shipping, verify that no accidental divergence exists outside V-001.

## Approved Variant Differences

### V-001 Intimacy entry visibility on Home
- **What**
  - **Internal**: Intimacy entry is visible on Home by default.
  - **Public**: Intimacy entry is hidden by default and unlocked conditionally.
- **Why**
  - Public onboarding should avoid immediate high-intimacy exposure for first-time users.
  - Internal build prioritizes full capability access for iterative testing.
- **Rule**
  - Public unlock condition: user has saved a Quick persona with
    - body mapping enabled, and
    - NSFW level in `flirty` or `explicit`.
- **Owner**
  - Product owner: AA
  - Implement/maintain: Corveil
- **Revisit**
  - Re-evaluate when public onboarding and age-gating strategy are finalized.

## Change Workflow
1. Classify each change as:
   - **Shared** (default)
   - **Variant-specific** (must match an approved entry above)
2. Implement shared changes in both repos.
3. If variant-specific and not listed yet: add entry first, then implement.
4. Keep PR/release notes referencing the variant id (e.g., `V-001`).

## Quick Checklist Before Deploy
- [ ] Did we change something shared? Sync both repos.
- [ ] Did we change a variant-only behavior? Confirm it is listed in this file.
- [ ] Did we accidentally add new divergence? If yes, either sync or document.
