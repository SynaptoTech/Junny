---
title: Getting Started
description: What Junny is, who it is for, and how the documentation is organized.
---

# Getting Started

Junny is an **open-source integration studio** for developers who work with HTTP APIs every day. It brings REST, GraphQL, SOAP, and WebSocket into a single, fast, **dark-first** workspace with collections, environments, and history — inspired by modern tools like Bruno and Hoppscotch, with a focus on clarity and speed.

## Goals

- **Install quickly** — Docker or plain Node.js (see [Installation](/installation/)).
- **Understand quickly** — protocol-focused guides and examples.
- **Contribute quickly** — Markdown docs in the repo; edit links on every page.

## What ships today

| Capability | Notes |
|------------|--------|
| REST workspace | Methods, URL, headers, body, auth, OpenAPI import |
| GraphQL | Query/mutation editor, variables, introspection |
| SOAP | XML envelopes and structured responses |
| WebSocket | Persistent connections and streamed messages |
| Collections & environments | Shared requests and variables across workspaces |
| Local API | NestJS + SQLite via Prisma |

Kafka and richer plugins are on the [Roadmap](/roadmap/).

## Documentation map

1. **[Installation](/installation/)** — run Junny locally or with Docker.  
2. **Protocols** — one page per protocol ([REST](/rest/), [GraphQL](/graphql/), …).  
3. **Workspace** — [Collections](/collections/) and [Environments](/environments/).  
4. **[API & Swagger](/api/)** — backend endpoints while developing.  

Future locales (e.g. Portuguese, Spanish) may appear alongside English; **English is the primary language** for public docs today.
