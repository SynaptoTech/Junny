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

    identity_secret = (os.environ.get("IDENTITY_CLIENT_SECRET") or "").strip()
    identity_enabled = (os.environ.get("IDENTITY_ENABLED") or ("true" if identity_secret else "")).strip()

    lines = [
        f"JWT_SECRET={jwt}",
        f"JUNNY_WEB_HOST_PORT={_host_port('JUNNY_WEB_HOST_PORT', '20052')}",
        f"JUNNY_API_HOST_PORT={_host_port('JUNNY_API_HOST_PORT', '20053')}",
    ]
    if identity_enabled:
        lines.append(f"IDENTITY_ENABLED={identity_enabled}")
    if identity_secret:
        lines.append(f"IDENTITY_CLIENT_SECRET={identity_secret}")
    for key, default in (
        ("IDENTITY_SERVICE_URL", "https://api-identity.synapto.com.br"),
        ("IDENTITY_CLIENT_ID", "junny"),
        ("IDENTITY_TENANT_SLUG", ""),
    ):
        val = (os.environ.get(key) or default).strip()
        if val:
            lines.append(f"{key}={val}")
    Path(".deploy-env").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
