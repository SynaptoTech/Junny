#!/usr/bin/env bash
set -euo pipefail

# Publica o estado atual no remoto GitHub sem:
#   .gitea/  coverage/  images/ (raiz)  infra/  md/
#
# Uso:
#   chmod +x scripts/push-github.sh
#   git remote add github git@github.com:SynaptoTech/Junny.git   # uma vez
#   ./scripts/push-github.sh
#
# Variáveis opcionais:
#   GITHUB_REMOTE  (default: github)
#   PUBLIC_BRANCH    (default: main)

REMOTE="${GITHUB_REMOTE:-github}"
BRANCH="${PUBLIC_BRANCH:-main}"
CURRENT="$(git branch --show-current 2>/dev/null || true)"
if [[ -z "${CURRENT}" ]]; then
  echo "Checkout uma branch (ex.: main) antes de rodar este script." >&2
  exit 1
fi

TMP_BRANCH="publish-github-$(date +%s)"

cleanup() {
  local code=$?
  git checkout "${CURRENT}" 2>/dev/null || true
  git branch -D "${TMP_BRANCH}" 2>/dev/null || true
  exit "${code}"
}
trap cleanup ERR INT

git branch "${TMP_BRANCH}"
git checkout "${TMP_BRANCH}"

git rm -rf --cached .gitea md infra coverage images 2>/dev/null || true

if git diff --cached --quiet; then
  echo "Nada a remover do índice (pastas já ausentes ou não rastreadas)."
  trap - ERR INT
  git checkout "${CURRENT}"
  git branch -D "${TMP_BRANCH}"
  exit 0
fi

git commit -m "chore: snapshot público para GitHub (sem caminhos privados)"

git push "${REMOTE}" "${TMP_BRANCH}:${BRANCH}" --force

trap - ERR INT
git checkout "${CURRENT}"
git branch -D "${TMP_BRANCH}"

echo "Push para ${REMOTE} (${BRANCH}) concluído."
