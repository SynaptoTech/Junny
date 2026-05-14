---
title: API & Swagger
description: Local NestJS API, Swagger UI, and how docs stay in sync over time.
---

# API & Swagger

Junny ships a **local NestJS API** for persistence (collections, environments, history) and protocol helpers. While developing, you can explore it interactively through **Swagger UI**.

## Swagger UI

When the API is running (default dev port **20053** unless overridden):

```txt
http://localhost:20053/api/docs
```

Use Swagger to:

- Browse routes and DTOs  
- Try authenticated flows during development  
- Copy **example payloads** into bug reports  

::: tip Production
If Junny is deployed behind a reverse proxy, the same path pattern (`/api/docs`) applies relative to your API origin — confirm with your deployment config.
:::

## Relationship to “your” APIs

Swagger documents **Junny’s backend**, not the third-party APIs you call from the workspaces. For external APIs, rely on their own OpenAPI specs or documentation — Junny’s REST workspace can import OpenAPI where supported.

## Future

- Richer **samples** and generated snippets per endpoint  
- Published **static OpenAPI** artifact alongside releases  

## Related

- [Installation](/installation/) — how to start the API locally  
