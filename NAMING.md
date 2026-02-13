# Naming Convention (persona-builder-web)

## 1) Core rule
Use kebab-case and stable prefixes:

`[scope]-[feature][-qualifier].ext`

Examples:
- `quick-main.js`
- `quick-engine.js`
- `quick-i18n.js`
- `quick-main.css`
- `workshop-home.css`
- `agent.js`

## 2) Entry files (do not rename)
To avoid breaking routes/bookmarks/deploy assumptions, keep these fixed:
- `index.html`
- `home.html`
- `intuition.html`
- `agent.html`
- `vault.html`
- `vault-persona.html`
- `vault-modules.html`

## 3) Backup/archive files
Never keep backup files in root. Move to `_archive/` and name as:

`YYYY-MM-DD-[scope]-[purpose]-backup-vX.Y.ext`

Example:
- `_archive/2026-02-13-public-backups/index-public-backup-v0.2.html`

## 4) Version markers
- For active runtime files: avoid version suffix in filename; track version in `VERSION` + `CHANGELOG.md`.
- For archival snapshots: include `vX.Y` in filename.

## 5) Fast checklist before adding a new file
- Is it runtime-critical? If yes, short stable name + no version in filename.
- Is it temporary/backup? If yes, put it under `_archive/` with date + version.
- Is naming readable by someone new in 5 seconds? If no, rename.
