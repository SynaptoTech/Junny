#!/usr/bin/env bash
# 1) Envia main ao Gitea (origin) — histórico completo, inclui .gitea/, md/, infra/, etc.
# 2) Publica no GitHub com infra/scripts/publish-to-github.sh (remove pastas listadas lá).
#
# Uso na raiz do repo:
#   ./infra/scripts/push-all-remotes.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

git checkout main

echo "→ Push main → origin (Gitea, completo)…"
git push origin main

exec "$SCRIPT_DIR/publish-to-github.sh"
