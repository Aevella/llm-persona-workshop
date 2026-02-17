#!/usr/bin/env bash
set -euo pipefail

EXPECTED="persona-builder-web-public"
FILE=".vercel/project.json"

if [[ ! -f "$FILE" ]]; then
  echo "[BLOCKED] Missing $FILE. Run 'vercel link' first." >&2
  exit 1
fi

if ! grep -q '"projectName"[[:space:]]*:[[:space:]]*"'"$EXPECTED"'"' "$FILE"; then
  echo "[BLOCKED] Repo linked to wrong Vercel project." >&2
  echo "Expected: $EXPECTED" >&2
  echo "Found in $FILE:" >&2
  cat "$FILE" >&2
  exit 1
fi

echo "[OK] Target verified: $EXPECTED"
vercel --prod --yes
