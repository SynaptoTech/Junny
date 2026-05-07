# Junny test layout (MD18)

This directory groups **cross-cutting** tests, **mocks**, and **E2E** configuration. App and package unit tests still live next to their source (e.g. `apps/server/test/`, `packages/core/src/*.spec.ts`).

## Layers

| Layer | Stack | Location |
|-------|--------|----------|
| Unit / integration (backend) | Jest + Supertest | `apps/server` (`*.spec.ts`, `*.e2e-spec.ts`) |
| Unit (shared TS) | Vitest | `packages/core` |
| Unit (Angular components) | Karma + Jasmine (existing) | `apps/web` — migrate to Vitest + Testing Library later (MD18) |
| E2E (browser) | Playwright | `tests/e2e/` |
| Mocks | Static fixtures | `tests/mocks/` |

## Coverage target

Initial goal: **~70%** on critical paths (REST engine, auth, environments, collections, history). Avoid chasing 100% or over-testing trivial UI.

## Running everything

From the monorepo root (after `npm install`):

```bash
npm test
```

E2E (requires the web app reachable — default `http://localhost:12050`):

```bash
npm run test:e2e
```

Set `SKIP_E2E=1` in CI if the UI is not started.

## Lint

ESLint + Prettier are used in the web app; align server formatting with the same Prettier config where applicable.

## Future

- Performance / load tests (WebSocket, Kafka) — not yet.  
- Heavy snapshot tests — avoid until stable.  
