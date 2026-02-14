# CHANGELOG

## v0.2.1 - 2026-02-12
- Quick architecture maintenance split (no feature change):
  - extracted i18n dictionary into `quick.i18n.js`
  - extracted engine/template/stack registries into `quick.engine.js`
  - rewired `index.html` loading order: `quick.i18n.js` -> `quick.engine.js` -> `script.js`
- Reduced `script.js` size/complexity for safer iteration while keeping behavior unchanged.
- Quick UX guidance improvements landed:
  - one-time onboarding hint bar (dismissible)
  - section guide lines and optional advanced customization fold
  - minimal-path hint copy for first-time users

## v0.2.0 - 2026-02-12
- Big iteration on Quick for play-first users:
  - Added **Human-like DIY (temporary)** panel that appears only when `更活人 / Human-like` is selected.
  - Added fine-grained controls for:
    - personality base
    - emotion modulation
    - relation action
    - self-stability under pressure
    - NSFW level (with explicit safety boundary language)
    - embodied cue toggle (light body-mapping hints)
  - DIY settings are merged into existing layer composer so output remains one coherent prompt instead of fragmented blocks.
- Updated top sticky strip copy for clearer intent:
  - Quick: 让AI知道如何说话
  - Deep: 让AI知道自己是谁
  - Agent: 更适合代理模式的模块区分
- Fixed sticky behavior issue where the strip stopped after short scroll:
  - moved sticky title outside short flow container to avoid parent-boundary clipping.

## v0.1.4 - 2026-02-12
- Refined product IA into clear layers (non-forced flow):
  - Quick = voice/style
  - Deep = subject skeleton
  - Agent = scenario behavior
  - Story = planned memory-first lane (home entry added as coming soon)
- Quick updates:
  - removed mirror-case import button from action area to reduce confusion with framework layer
  - added export-by-type controls (Full / Compact / JSON + single export button)
- Agent updates:
  - changed export from multi-file burst to current-file export
  - added one-click copy for current preview with copied-state feedback
  - default mode fields now start empty; examples are explicit opt-in
  - added `fillModeExample` (fill only current mode example)
  - kept full-case loader `loadPharosCase` for full demo path
- Added sticky mini navigation on Quick/Deep/Agent:
  - removed step numbering (1/2/3)
  - shows current layer in plain language
  - keeps cross-page switch buttons without forcing linear progression
- Theme polish:
  - aligned glow/border behavior with per-page theme color (Quick gold, Deep pink, Agent white)
- Home updates:
  - added Story entry card (coming soon, disabled state)

## v0.1.3 - 2026-02-12
- Completed bilingual coverage across Home / Quick / Deep major UX text paths.
- Added stack conflict detection toast in Quick (soft warning, non-blocking) for key contradiction pairs.
- Upgraded conflict toast style to match black-gold theme with fade-in/out timing.
- Refined Deep output architecture to dual view:
  - default user-facing subject summary
  - collapsible LLM payload for expansion workflows
- Restored long-form CN template voices for `猫娘♡` and `Monday` after accidental compression.
- Refactored layer composition in `buildLayers` to field-level merge/dedupe to reduce repeated clauses.
- Added and expanded unified project guardrails (`GUARDRAILS.md`) including:
  - prompt quality checks
  - engine/stack registration discipline
  - localStorage capacity policy
  - staged performance gates (v1.0 threshold policy)

## v0.1.2 - 2026-02-12
- Integrated collaborator patch from `persona-builder-web-v0.1.2` into `script.js`.
- Added engine-aware suffix architecture (`ENGINE_SUFFIXES`) so generated layer endings adapt by engine type and reduce cross-style contradiction.
- Upgraded advanced style fragments (亲密 / 幽默 / 细腻) with improved safety and elasticity behavior.

## v0.1.1 - 2026-02-11
- Refined engine selector UI to compact glowing rounded blocks.
- Updated engine labels and notes:
  - 更活人 / 更效率 / 更守规 / 猫娘♡
- Reworked style fragments:
  - 果断 / 专业 / 简短 / 安全 / 亲密 / 幽默 / 细腻
- Tuned baseline content for 更活人 / 更效率 / 更守规.

## v0.1.0 - 2026-02-11
- Initial public prototype released.
- Added Workshop split: Quick / Deep entry.
- Quick builder: core engine single-select + style fragment multi-select.
- Added one-click copy for Full/Compact outputs.
- Added logo + favicon integration.
- Added catgirl template (`猫娘♡`).
- Added auto-growing textareas.
- Added stack rollback behavior (uncheck can revert from baseline).
- Added punctuation normalization to reduce malformed punctuation joins.
