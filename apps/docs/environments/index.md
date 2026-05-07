---
title: Environments
description: Variables and active environment selection across workspaces.
---

# Environments

**Environments** hold named variables (e.g. base URLs, tokens, tenant IDs) so the same request definitions work across **local**, **staging**, and **production-like** targets without duplication.

## Active environment

Pick the **active** environment from the workspace sidebar. Requests interpolate variables where supported — see product UX for the exact placeholder syntax.

## Good practices

- Never commit **secrets** — use local overrides or private env files outside git.  
- Keep variable names **stable** (`api_base`, `access_token`) so collections remain readable.  
- Document mandatory variables in your team wiki when onboarding.

## Related

- [Collections](/collections/) — stored requests that consume environment variables  
