# Junny

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js 20+](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

**Open Integration Studio** for REST, SOAP, GraphQL, WebSocket, Kafka (roadmap), and more — developer-first, dark-first UI.

Official public repository: **[github.com/SynaptoTech/Junny](https://github.com/SynaptoTech/Junny)** · Website: **[junny.dev.br](https://junny.dev.br)**

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
| gRPC workspace                             | Roadmap ([MD21](md/MD21_JUNNY_GRPC_WORKSPACE.md)) — `/app/grpc`                                 |
| cURL import & codegen                      | Roadmap ([MD22](md/MD22_JUNNY_CURL_IMPORT_CODEGEN.md)) — `/app/codegen`                         |
| Collection / request runner                | Roadmap ([MD23](md/MD23_JUNNY_REQUEST_RUNNER.md)) — `/app/runner`                               |
| Mock server (fake APIs)                    | Roadmap ([MD24](md/MD24_JUNNY_MOCK_SERVER_SYSTEM.md)) — `/app/mock`                             |
| Security & secrets                         | Roadmap ([MD25](md/MD25_JUNNY_SECURITY_SECRETS_ARCHITECTURE.md)) — `/app/security`              |
| Sync & cloud strategy                      | Roadmap ([MD26](md/MD26_JUNNY_SYNC_ARCHITECTURE_CLOUD_STRATEGY.md)) — `/app/sync`               |
| Workspace layout (panes / tabs)            | Roadmap ([MD27](md/MD27_JUNNY_WORKSPACE_LAYOUT_SYSTEM.md)) — `/app/workspace-layout`            |
| Native desktop (Tauri)                     | Roadmap ([MD28](md/MD28_JUNNY_NATIVE_DESKTOP_STRATEGY.md)) — `/app/desktop`                     |
| Enterprise & team workspaces               | Roadmap ([MD29](md/MD29_JUNNY_ENTERPRISE_TEAM_WORKSPACES.md)) — `/app/team`                     |
| Official roadmap v1 (consolidado)          | [MD30](md/MD30_JUNNY_OFFICIAL_ROADMAP_V1.md) — `/app/official`                                  |
| API monitoring (uptime · health · alertas) | Roadmap ([MD31](md/MD31_JUNNY_API_MONITORING_SYSTEM.md)) — `/app/monitoring`                    |
| Contract testing & schema validation       | Roadmap ([MD32](md/MD32_JUNNY_CONTRACT_TESTING_SCHEMA_VALIDATION.md)) — `/app/contracts`        |
| API diff & schema compare                  | Roadmap ([MD33](md/MD33_JUNNY_API_DIFF_SYSTEM.md)) — `/app/diff`                                |
| Traffic interceptor · HTTP inspector       | Roadmap ([MD34](md/MD34_JUNNY_TRAFFIC_INTERCEPTOR_HTTP_INSPECTOR.md)) — `/app/interceptor`      |
| Browser extension · request capture        | Roadmap ([MD35](md/MD35_JUNNY_BROWSER_EXTENSION_REQUEST_CAPTURE.md)) — `/app/browser-extension` |
| AI request generator                       | Roadmap ([MD36](md/MD36_JUNNY_AI_REQUEST_GENERATOR.md)) — `/app/ai-generator`                   |
| AI response analyzer                       | Roadmap ([MD37](md/MD37_JUNNY_AI_RESPONSE_ANALYZER.md)) — `/app/ai-analyzer`                    |
| AI workflow builder                        | Roadmap ([MD38](md/MD38_JUNNY_AI_WORKFLOW_BUILDER.md)) — `/app/workflows`                       |
| Plugin marketplace                         | Roadmap ([MD39](md/MD39_JUNNY_PLUGIN_MARKETPLACE.md)) — `/app/marketplace`                      |
| Enterprise self-hosted platform            | Roadmap ([MD40](md/MD40_JUNNY_ENTERPRISE_SELF_HOSTED_PLATFORM.md)) — `/app/enterprise`          |
| API performance profiler                   | Roadmap ([MD41](md/MD41_JUNNY_API_PERFORMANCE_PROFILER.md)) — `/app/profiler`                   |
| Realtime observability dashboard           | Roadmap ([MD42](md/MD42_JUNNY_REALTIME_OBSERVABILITY_DASHBOARD.md)) — `/app/observability`      |
| Secrets vault enterprise                   | Roadmap ([MD43](md/MD43_JUNNY_SECRETS_VAULT_ENTERPRISE.md)) — `/app/vault`                      |
| AI API documentation generator             | Roadmap ([MD44](md/MD44_JUNNY_AI_API_DOCUMENTATION_GENERATOR.md)) — `/app/ai-docs`              |
| AI OpenAPI generator · schema builder      | Roadmap ([MD45](md/MD45_JUNNY_AI_OPENAPI_GENERATOR.md)) — `/app/ai-openapi`                     |
| Event streaming studio · Kafka debugger    | Roadmap ([MD46](md/MD46_JUNNY_EVENT_STREAMING_STUDIO.md)) — `/app/streaming`                    |
| Git native collections · version control   | Roadmap ([MD48](md/MD48_JUNNY_GIT_NATIVE_COLLECTIONS.md)) — `/app/git`                          |
| Landing enterprise + trust (positioning)   | Done ([MD57](md/MD57_JUNNY_LANDING_ENTERPRISE_TRUST_STRATEGY.md)) — landing                     |
| Landing i18n + docs integration              | Done ([MD58](md/MD58_JUNNY_LANDING_I18N_DOCS_INTEGRATION.md)) — `/en` · `/pt-br` · `/es` · `/docs/` |
| Landing performance + Core Web Vitals       | Done ([MD59](md/MD59_JUNNY_LANDING_PERFORMANCE_LIGHTHOUSE.md)) — fonts, GPU motion, a11y skip link |
| Landing v2 fecho + checklist produção       | Done ([MD60](md/MD60_JUNNY_LANDING_FINAL_ASSEMBLY_PRODUCTION_CHECKLIST.md)) — [checklist](./md/MD60_LAUNCH_CHECKLIST.md), nginx, meta social |
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
  /plugin-sdk — MD19
  /ai-sdk — MD20 roadmap constants (sem LLM)

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

- **UI:** http://localhost:12050
- **API:** http://localhost:13050

Optional: `cp .env.example .env`. Production-style stack: `docker compose -f docker-compose.prod.yml` (see [`docker-compose.prod.yml`](docker-compose.prod.yml)).

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

## Testing (MD18)

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

- **Synapto (internal Gitea):** full history including `.gitea/`, `infra/`, `md/`, etc.
- **GitHub (public mirror):** same codebase; use `scripts/push-github.sh` after local commits when publishing to the public remote.

---

## Status

Early development — feedback and PRs welcome.

---

## License

[MIT](LICENSE)
