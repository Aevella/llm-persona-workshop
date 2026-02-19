#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

errors=0
warns=0

# Files/paths that must NOT exist in public
blocked=(
  "PROJECT_NOTE.md"
  "SMOKE_CHECKLIST.md"
  "_share"
  "docs/ENGINEERING_GUARD_CHECKLIST.md"
  "docs/HIGH_TOUCH_POLISH.md"
  "docs/INTIMACY_SPEC_V0.1.md"
)

# Files that should exist in public
required=(
  "manifest.webmanifest"
  "manifest.en.webmanifest"
  "manifest.zh.webmanifest"
  "sw.js"
  "sw-register.js"
  "scripts/release-bump.sh"
  "scripts/deploy-public.sh"
)

echo "[boundary] checking blocked internal artifacts..."
for p in "${blocked[@]}"; do
  if [ -e "$p" ]; then
    echo "ERROR: blocked artifact found in public: $p"
    errors=$((errors+1))
  fi
done

echo "[boundary] checking required public artifacts..."
for p in "${required[@]}"; do
  if [ ! -e "$p" ]; then
    echo "WARN: required public artifact missing: $p"
    warns=$((warns+1))
  fi
done

echo "[boundary] done: errors=$errors warns=$warns"
if [ "$errors" -gt 0 ]; then
  exit 1
fi
