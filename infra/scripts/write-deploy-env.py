#!/usr/bin/env python3
"""Gera `.deploy-env` no CWD a partir dos secrets do Gitea (CI). Invocado como `python3 infra/scripts/write-deploy-env.py` na raiz do repo."""
import os
from pathlib import Path


def _host_port(key: str, default: str) -> str:
    v = (os.environ.get(key) or "").strip()
    return v or default


def main() -> None:
    jwt = (os.environ.get("JWT_SECRET") or "").strip()
    if not jwt:
        raise SystemExit("Define JWT_SECRET no Gitea.")

    lines = [
        f"JWT_SECRET={jwt}",
        f"JUNNY_WEB_HOST_PORT={_host_port('JUNNY_WEB_HOST_PORT', '20052')}",
        f"JUNNY_API_HOST_PORT={_host_port('JUNNY_API_HOST_PORT', '20053')}",
    ]
    Path(".deploy-env").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
