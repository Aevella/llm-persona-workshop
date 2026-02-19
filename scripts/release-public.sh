#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/release-public.sh patch
#   ./scripts/release-public.sh minor
#   ./scripts/release-public.sh major
#   ./scripts/release-public.sh --version v0.3.0 --note "public baseline"
#
# This script does not deploy automatically.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

./scripts/check-variant-boundary.sh
./scripts/release-bump.sh "$@"

echo "[NEXT] review changes: git status"
echo "[NEXT] commit + push"
echo "[NEXT] deploy if needed: ./scripts/deploy-public.sh"
