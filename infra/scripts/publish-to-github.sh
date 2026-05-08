#!/usr/bin/env bash
# Atualiza a branch public-github a partir do main do Gitea, remove pastas internas
# (lista em github-publish-excludes.txt) e faz push só para o remote github.
#
# Uso (na raiz do repo):
#   ./infra/scripts/publish-to-github.sh

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

MAIN_BRANCH="${MAIN_BRANCH:-main}"
PUB_BRANCH="${PUB_BRANCH:-public-github}"
EXCLUDES="${ROOT}/infra/scripts/github-publish-excludes.txt"

if [[ ! -f "$EXCLUDES" ]]; then
  echo "Falta $EXCLUDES"
  exit 1
fi

if ! git remote get-url github >/dev/null 2>&1; then
  echo "Configure o remote 'github'."
  exit 1
fi

git fetch origin

git checkout "$MAIN_BRANCH"
git pull origin "$MAIN_BRANCH" 2>/dev/null || true

if git show-ref --verify --quiet "refs/heads/$PUB_BRANCH"; then
  git checkout "$PUB_BRANCH"
  if ! git merge "origin/$MAIN_BRANCH" -m "merge: sincronizar main (Gitea) para mirror público"; then
    echo "Conflito no merge. Resolve, commit e volta a correr este script."
    exit 1
  fi
else
  echo "Criando $PUB_BRANCH a partir de $MAIN_BRANCH…"
  git checkout -b "$PUB_BRANCH" "$MAIN_BRANCH"
fi

stripped=false
while IFS= read -r raw || [[ -n "$raw" ]]; do
  [[ "$raw" =~ ^[[:space:]]*# ]] && continue
  path="${raw%%#*}"
  path="$(echo "$path" | sed 's/[[:space:]]*$//;s/^[[:space:]]*//')"
  [[ -z "$path" ]] && continue

  if [[ -n "$(git ls-files "$path" 2>/dev/null || true)" ]]; then
    git rm -rf "$path"
    stripped=true
  fi
done < "$EXCLUDES"

if [[ "$stripped" == true ]]; then
  git commit -m "chore(public): remover caminhos internos do mirror GitHub"
fi

git push github "$PUB_BRANCH"

git checkout "$MAIN_BRANCH"

echo "Concluído: github/$PUB_BRANCH (sem pastas da lista de exclusão). Em $MAIN_BRANCH."
