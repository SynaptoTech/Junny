#!/usr/bin/env bash
set -euo pipefail

# Public push helper:
# - cria/atualiza a branch public-github baseada em origin/main
# - remove pastas internas que não devem ir pro GitHub público
# - faz push só da public-github para o remote github
#
# Uso:
#   git remote add github git@github.com:SynaptoTech/Junny.git   # uma vez
#   ./scripts/push-github.sh
#
# Variável opcional: GITHUB_REMOTE (default: github)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BASE_BRANCH="main"
PUBLIC_BRANCH="public-github"
REMOTE="${GITHUB_REMOTE:-github}"

EXCLUDE_PATHS=(
  ".gitea"
  "coverage"
  "images"
  "infra"
  "md"
  "scripts"
)

git fetch origin "$BASE_BRANCH"

if git show-ref --verify --quiet "refs/heads/$PUBLIC_BRANCH"; then
  git switch "$PUBLIC_BRANCH"
  git reset --hard "origin/$BASE_BRANCH"
else
  git switch -c "$PUBLIC_BRANCH" "origin/$BASE_BRANCH"
fi

for p in "${EXCLUDE_PATHS[@]}"; do
  if [ -e "$p" ]; then
    git rm -r --cached "$p" >/dev/null 2>&1 || true
  fi
done

if ! git diff --cached --quiet; then
  git commit -m "chore(public): refresh public branch"
fi

git push --force-with-lease -u "$REMOTE" "$PUBLIC_BRANCH"

echo "OK: pushed $PUBLIC_BRANCH to $REMOTE"

# Após `git rm --cached`, os ficheiros ficam na árvore como untracked e impedem
# `git switch main`. Estas pastas são reconstruídas ao voltar para main.
git clean -fdq .gitea images infra md 2>/dev/null || true

git switch "$BASE_BRANCH"
echo "Switched back to $BASE_BRANCH"
