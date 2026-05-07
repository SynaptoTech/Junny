---
title: Installation
description: Install and run Junny with Docker Compose or Node.js npm workspaces.
---

# Installation

Choose **Docker** for the fastest path on macOS, Linux, or Windows (Docker Desktop). Use **Node.js** directly if you prefer your host toolchain.

## Requirements

- **Node.js 20+** (see `.nvmrc` or `engines` in the root `package.json` when added).
- **Docker Compose v2** (optional but recommended).

## Option A — Docker (recommended)

From the repository root:

```bash
git clone https://github.com/SynaptoTech/Junny.git
cd Junny
docker compose up
```

Defaults (see `docker-compose.yml` and `.env.example`):

| Service | URL |
|---------|-----|
| Web (Angular dev server) | `http://localhost:12050` |
| API (NestJS) | `http://localhost:13050` |

The frontend expects the API at `http://localhost:13050` in development (see `apps/web` environment files).

To rebuild after dependency changes:

```bash
docker compose up --build
```

Production-like stack (pre-built images, different ports) lives in `docker-compose.prod.yml`.

## Option B — Local Node.js

```bash
git clone https://github.com/SynaptoTech/Junny.git
cd Junny
npm install
```

Then in **two terminals**:

```bash
npm run start:server
```

```bash
npm run start:web
```

Run Prisma migrations against your SQLite database when the schema changes (from repo conventions — typically under `apps/server`).

Full workspace build:

```bash
npm run build
```

## Documentation site (this site)

From the monorepo root:

```bash
npm run build -w @junny/docs
# or, for local preview:
cd apps/docs && npm run dev
```

VitePress runs a local dev server (port shown in the terminal) and produces a static `dist` on build for hosting.

## Next

- [REST workspace](/rest/) — your first requests  
- [API & Swagger](/api/) — explore the local API surface  
