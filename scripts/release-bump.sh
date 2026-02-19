#!/usr/bin/env bash
set -euo pipefail

# Usage examples:
#   ./scripts/release-bump.sh                 # bump patch
#   ./scripts/release-bump.sh minor           # bump minor
#   ./scripts/release-bump.sh major           # bump major
#   ./scripts/release-bump.sh --version v0.4.0 --note "PWA rollout"
#   ./scripts/release-bump.sh --version v0.3.1 --no-changelog  # sync VERSION/index only

MODE="patch"
FORCE_VERSION=""
NOTE=""
NO_CHANGELOG=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    patch|minor|major)
      MODE="$1"
      shift
      ;;
    --version)
      FORCE_VERSION="${2:-}"
      shift 2
      ;;
    --note)
      NOTE="${2:-}"
      shift 2
      ;;
    --no-changelog)
      NO_CHANGELOG=1
      shift
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION_FILE="$ROOT/VERSION"
INDEX_FILE="$ROOT/index.html"
CHANGELOG_FILE="$ROOT/CHANGELOG.md"

python3 - <<'PY' "$VERSION_FILE" "$INDEX_FILE" "$CHANGELOG_FILE" "$MODE" "$FORCE_VERSION" "$NOTE" "$NO_CHANGELOG"
import re,sys,datetime,pathlib
version_file,index_file,changelog_file,mode,force_version,note,no_changelog = sys.argv[1:]
no_changelog = no_changelog == '1'

vf=pathlib.Path(version_file)
ix=pathlib.Path(index_file)
cl=pathlib.Path(changelog_file)

cur=vf.read_text(encoding='utf-8').strip()
m=re.fullmatch(r'v?(\d+)\.(\d+)\.(\d+)',cur)
if not m:
    raise SystemExit(f"Invalid VERSION format: {cur}")
major,minor,patch=map(int,m.groups())

if force_version:
    m2=re.fullmatch(r'v?(\d+)\.(\d+)\.(\d+)',force_version)
    if not m2:
        raise SystemExit(f"Invalid --version: {force_version}")
    major,minor,patch=map(int,m2.groups())
else:
    if mode=='major':
        major += 1; minor = 0; patch = 0
    elif mode=='minor':
        minor += 1; patch = 0
    else:
        patch += 1

new=f"v{major}.{minor}.{patch}"

# 1) VERSION
vf.write_text(new+'\n',encoding='utf-8')

# 2) index.html visible version badge
txt=ix.read_text(encoding='utf-8')
new_txt, n = re.subn(r'(<span\s+class="ver">)v?\d+\.\d+\.\d+(</span>)', rf'\g<1>{new}\2', txt, count=1)
if n:
    ix.write_text(new_txt,encoding='utf-8')

# 3) CHANGELOG prepend section (optional)
if not no_changelog:
    today=datetime.date.today().isoformat()
    cl_txt=cl.read_text(encoding='utf-8')
    heading=f"## {new} - {today}"
    if heading not in cl_txt:
        note_line = f"- {note}\n" if note else "- Release updates.\n"
        insert = f"\n{heading}\n{note_line}"
        if cl_txt.startswith('# CHANGELOG'):
            cl_txt = cl_txt.replace('# CHANGELOG\n', '# CHANGELOG\n'+insert, 1)
        else:
            cl_txt = '# CHANGELOG\n'+insert+'\n'+cl_txt
        cl.write_text(cl_txt,encoding='utf-8')

print(new)
PY

echo "[OK] release version updated"