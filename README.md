# Junny

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js 20+](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

**Open Integration Studio** for REST, SOAP, GraphQL, WebSocket, Kafka (roadmap), and more — developer-first, dark-first UI.

Official public repository: **[github.com/SynaptoTech/Junny](https://github.com/SynaptoTech/Junny)** · Website: **[junny.dev.br](https://junny.dev.br)**

Built by **[Synapto](https://www.synapto.com.br)**.

---

## Screenshots

_Add UI screenshots or short GIFs here as the product stabilizes (landing, REST workspace, GraphQL, etc.)._

---

## Roadmap (high level)

| Area                                       | Status                                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| REST workspace                             | Available                                                                                       |
| GraphQL                                    | Available                                                                                       |
| SOAP                                       | Available                                                                                       |
| WebSocket                                  | Available                                                                                       |
| Kafka workspace                            | Planned                                                                                         |
| gRPC workspace                             | Roadmap — `/app/grpc`                                 |
| cURL import & codegen                      | Roadmap — `/app/codegen`                         |
| Collection / request runner                | Roadmap — `/app/runner`                               |
| Mock server (fake APIs)                    | Roadmap — `/app/mock`                             |
| Security & secrets                         | Roadmap — `/app/security`              |
| Sync & cloud strategy                      | Roadmap — `/app/sync`               |
| Workspace layout (panes / tabs)            | Roadmap — `/app/workspace-layout`            |
| Native desktop (Tauri)                     | Roadmap — `/app/desktop`                     |
| Enterprise & team workspaces               | Roadmap — `/app/team`                     |
| Official roadmap v1 (consolidado)          | Roadmap — `/app/official`                                  |
| API monitoring (uptime · health · alertas) | Roadmap — `/app/monitoring`                    |
| Contract testing & schema validation       | Roadmap — `/app/contracts`        |
| API diff & schema compare                  | Roadmap — `/app/diff`                                |
| Traffic interceptor · HTTP inspector       | Roadmap — `/app/interceptor`      |
| Browser extension · request capture        | Roadmap — `/app/browser-extension` |
| AI request generator                       | Roadmap — `/app/ai-generator`                   |
| AI response analyzer                       | Roadmap — `/app/ai-analyzer`                    |
| AI workflow builder                        | Roadmap — `/app/workflows`                       |
| Plugin marketplace                         | Roadmap — `/app/marketplace`                      |
| Enterprise self-hosted platform            | Roadmap — `/app/enterprise`          |
| API performance profiler                   | Roadmap — `/app/profiler`                   |
| Realtime observability dashboard           | Roadmap — `/app/observability`      |
| Secrets vault enterprise                   | Roadmap — `/app/vault`                      |
| AI API documentation generator             | Roadmap — `/app/ai-docs`              |
| AI OpenAPI generator · schema builder      | Roadmap — `/app/ai-openapi`                     |
| Event streaming studio · Kafka debugger    | Roadmap — `/app/streaming`                    |
| Git native collections · version control   | Roadmap — `/app/git`                          |
| Landing enterprise + trust (positioning)   | Done — landing                     |
| Landing i18n + docs integration              | Done — `/en` · `/pt-br` · `/es` · `/docs/` |
| Landing performance + Core Web Vitals       | Done — fonts, GPU motion, a11y skip link |
| Landing v2 fecho + checklist produção       | Done — checklist produção, nginx, meta social |
| Plugins / extensions                       | Future                                                                                          |
| AI-assisted flows                          | Future                                                                                          |

Semantic versioning: **`v0.x.x`** (`MAJOR.MINOR.PATCH`). Releases are published from `main` when tagged.

---

## Features

- REST, GraphQL, SOAP, WebSocket workspaces
- OpenAPI import, collections, environments, request history
- Local NestJS API + SQLite (Prisma)
- Dockerized dev environment (`docker compose up`)
- MIT license

---

## Monorepo layout

```text
/apps
  /web       — Angular (landing + app)
  /server    — NestJS API
  /docs      — VitePress docs site

/packages
  /core, /sdk, /ui, /protocols
  /plugin-sdk — plugin manifests & APIs
  /ai-sdk — roadmap constants (sem LLM)

/plugins     — bundled plugin layouts (manifest only; no loader yet)

/examples    — snippets
```

---

## Quick start

### Requirements

- **Node.js 20+**
- First-time setup: `npm install` at the **repository root** (npm workspaces).

### Docker (recommended for contributors)

```bash
docker compose up
```

- **UI:** http://localhost:20052
- **API:** http://localhost:20053

Optional: `cp .env.example .env`. Production-style stack: `docker compose -f docker-compose.prod.yml` (see [`docker-compose.prod.yml`](docker-compose.prod.yml)); define `JWT_SECRET` (e opcionalmente `JUNNY_WEB_HOST_PORT` / `JUNNY_API_HOST_PORT`) no `.env` do servidor.

### CI / deploy (Gitea)

`.gitea/workflows/deploy.yml`: jobs **prepare** → **sync-code** (rsync) → **remote-docker** (`.env` via [`infra/scripts/write-deploy-env.py`](infra/scripts/write-deploy-env.py) + `docker compose -f docker-compose.prod.yml`) → **verify** (curl **20052** e **20053/v1/health**). Runner `ubuntu-latest` + `ghcr.io/catthehacker/ubuntu:act-22.04`. **Sem** cópia de Nginx/Certbot no SO (TLS no **NPM**). Secrets: `SSH_KEY`, `SSH_USER`, `SSH_HOST`, `APP_DIR`, `JWT_SECRET`; opcional `JUNNY_WEB_HOST_PORT`, `JUNNY_API_HOST_PORT`.

After changing dependencies, rebuild images: `docker compose up --build`. To reset dependency volumes: `docker compose down -v`.

### Without Docker

```bash
npm install
npm run start:server   # API (watch)
npm run start:web      # Angular dev server (second terminal)
```

### Scripts (root)

| Script                | Description                 |
| --------------------- | --------------------------- |
| `npm run build`       | Build web, server, and docs |
| `npm run docker:up`   | `docker compose up`         |
| `npm run docker:down` | Stop dev containers         |
| `npm run docker:logs` | Follow logs                 |
| `npm run docker:prod` | Prod compose locally        |

---

## Testing

| Command            | What runs                                                                             |
| ------------------ | ------------------------------------------------------------------------------------- |
| `npm test`         | Jest + Supertest (`@junny/server`), Vitest (`@junny/core`)                            |
| `npm run test:cov` | Same + coverage report for the API workspace                                          |
| `npm run test:e2e` | Playwright (specs **disabled** unless `E2E=1`; uses `--pass-with-no-tests` when idle) |

Opt-in browser smoke tests: start the web UI (`docker compose up` or `npm run start:web`), then:

```bash
npx playwright install chromium   # once per machine
E2E=1 npm run test:e2e
```

See [`tests/README.md`](tests/README.md) for layout (`tests/mocks`, future integration/E2E).

---

## Contributing

Please read **[`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md)** (setup, branches, commits, PR flow).

- **[Code of Conduct](.github/CODE_OF_CONDUCT.md)** — Contributor Covenant
- **[Security policy](.github/SECURITY.md)** — report vulnerabilities privately
- **[Issue templates](.github/ISSUE_TEMPLATE/)** — bug, feature, docs, question
- **[GitHub Discussions](https://github.com/SynaptoTech/Junny/discussions)** — ideas, roadmap chat, Q&A

Suggested labels for maintainers: `bug`, `enhancement`, `documentation`, `good first issue`, `help wanted`, `discussion`, `roadmap`.

---

## Documentation portal

Docs live under **`apps/docs`** (VitePress). Intended public URL: **[junny.dev.br/docs/](https://junny.dev.br/docs/)** (`base: '/docs/'`).

```bash
npm run build -w @junny/docs   # static output for deploy
cd apps/docs && npm run dev    # local preview (URL printed by VitePress)
```

Includes search (local provider), dark-first theme, `robots.txt` / `sitemap.xml` under `apps/docs/public/`.

---

## Repositories

- **Synapto (Gitea interno):** repositório canónico **`Tools/Junny`** (`https://git.synapto.com.br/Tools/Junny.git`). Inclui `.gitea/`, `md/`, `infra/`, etc. Push típico: `git push origin main` (ou `git push gitea-ssh main` se usares o remoto SSH).
- **GitHub (mirror público):** remoto **`github`** — mantém-se como está (`git@github.com:SynaptoTech/Junny.git`). Branch `public-github`. Algumas pastas **não** são publicadas (por defeito `.gitea/` e `md/` — lista em `infra/scripts/github-publish-excludes.txt`). Depois de commits no `main`, corre `./infra/scripts/publish-to-github.sh` ou `./infra/scripts/push-all-remotes.sh` (Gitea + GitHub).

---

## Status

Early development — feedback and PRs welcome.

---

## License

[MIT](LICENSE)

## Ownership, branding, and official distribution

Junny is an **open source integration platform**.

- **Open Source Core**: the code is open source under the project license.
- **Official Distribution**: official releases and docs are maintained by **Synapto**.
- **Branding Protection**: the Junny name, logo, branding, and official assets are protected.

See:

- [`TRADEMARK.md`](TRADEMARK.md)
- [`BRANDING.md`](BRANDING.md)
