#!/usr/bin/env bash
# Envia a mesma branch public-github ao Gitea (origin) e ao GitHub (github).
# Uso (na raiz do repo):
#   ./infra/scripts/push-all-remotes.sh
#   BRANCH=outra ./infra/scripts/push-all-remotes.sh
#
# Pré-requisitos: remotes `origin` e `github` configurados.

set -euo pipefail

BRANCH="${BRANCH:-public-github}"

current="$(git branch --show-current)"
if [[ "$current" != "$BRANCH" ]]; then
  echo "Tens de estar na branch '$BRANCH' (agora: '$current')."
  echo "  git checkout $BRANCH"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' não configurado."
  exit 1
fi

if ! git remote get-url github >/dev/null 2>&1; then
  echo "Remote 'github' não configurado. Exemplo:"
  echo "  git remote add github git@github.com:SynaptoTech/Junny.git"
  exit 1
fi

echo "→ Push $BRANCH → origin…"
git push origin "$BRANCH"

echo "→ Push $BRANCH → github…"
git push github "$BRANCH"

echo "Feito: origin/$BRANCH e github/$BRANCH."
