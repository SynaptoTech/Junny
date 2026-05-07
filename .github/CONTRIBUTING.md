# Contributing to Junny

Thank you for your interest in Junny. This project aims to stay **contributor-friendly**, transparent, and easy to run locally.

## Prerequisites

- **Node.js 20+**
- **npm** (workspaces at the repo root)
- Optional: **Docker** + **Docker Compose v2** for the recommended dev environment

## Quick start

### Docker (recommended)

From the repository root:

```bash
docker compose up
```

Then open:

- **Web UI:** http://localhost:12050  
- **API:** http://localhost:13050  

See `docker-compose.yml`, `.env.example`, and the main **README** for ports, volumes, and production compose (`docker-compose.prod.yml`).

### Without Docker

```bash
npm install
npm run start:server   # NestJS (watch) — API
npm run start:web      # Angular dev server (in another terminal)
```

Run tests and builds before opening a PR:

```bash
npm test
npm run build
```

**Test stack:** API integration tests use **Jest + Supertest** (`apps/server`). Shared TypeScript uses **Vitest** (`packages/core`). **Playwright** specs live under `tests/e2e/` and run only when `E2E=1` (install browsers once: `npx playwright install chromium`). Default `npm run test:e2e` skips browser tests so CI stays lightweight until you opt in.

Coverage reports land under `**/coverage/` (gitignored; do not commit).

## Branching model

| Branch | Purpose |
|--------|---------|
| `main` | Stable, release-ready code |
| `develop` | Integration branch for ongoing work (when used) |
| `feature/*` | Feature branches (example: `feature/improve-graphql-editor`) |

Open PRs **against `main`** unless maintainers ask otherwise.

## Commit messages

We encourage [**Conventional Commits**](https://www.conventionalcommits.org/) style when possible:

- `feat:` new feature  
- `fix:` bug fix  
- `docs:` documentation only  
- `chore:` tooling, CI, deps  
- `refactor:` code change without behavior change  

Keep the subject line short; use the body for context.

## Pull request flow

1. **Fork** the repository (if you lack write access).  
2. Create a branch from `main`.  
3. Make focused changes; avoid unrelated drive-by refactors.  
4. Ensure **`npm run build`** passes for workspaces you touched.  
5. Open a PR using the template and describe **what** and **why**.  

Maintainers may request tests or docs updates before merge.

## Issue labels (for maintainers)

Suggested GitHub labels:

| Label | Meaning |
|-------|---------|
| `bug` | Something is broken |
| `enhancement` | Improvement or new capability |
| `documentation` | Docs only |
| `good first issue` | Friendly for newcomers |
| `help wanted` | Extra hands welcome |
| `discussion` | Needs conversation before coding |
| `roadmap` | Tied to product direction |

## Security

Do **not** open public issues for security vulnerabilities. See [SECURITY.md](./SECURITY.md).

## Code of conduct

All participants must follow the [Contributor Covenant](./CODE_OF_CONDUCT.md). Harassment and exclusionary behavior are not tolerated.

## Questions

Use [GitHub Discussions](https://github.com/SynaptoTech/Junny/discussions) for ideas, roadmap chat, and general questions when unsure whether to file an issue.

---

Thank you for helping make Junny a modern, international open-source developer tool.
