# Junny

Open Integration Studio for REST, SOAP, GraphQL, Kafka and beyond.

## Monorepo

```text
/apps
  /web       — Angular (landing, app futura)
  /server    — NestJS (proxy local, protocolos, persistência SQLite inicial)
  /docs      — VitePress (documentação pública)

/packages
  /core      — tipos e utilitários compartilhados
  /sdk       — SDK / integrações externas
  /ui        — design system (evolução futura)
  /protocols — abstrações REST/SOAP/GraphQL/…

/examples    — exemplos e snippets
```

### Scripts (na raiz)

- `npm run build` — build de web, server e docs
- `npm run start:web` — dev server Angular
- `npm run start:server` — API Nest em modo watch

Requer **Node.js 20+**. Na primeira vez: `npm install` na raiz (workspaces).

## Features

- REST
- SOAP
- GraphQL
- Kafka (planned)
- OpenAPI/Swagger
- Collections
- Environments
- Developer-first experience

## Status

Early development 🚧

## Website

https://junny.dev.br

## Repositórios

- **Synapto (Gitea, interno):** histórico completo, inclui `.gitea/`, `infra/`, `md/`, `coverage/`, `images/` na raiz, etc.
- **GitHub (público):** mesmo código, sem as pastas privadas listadas no planejamento do projeto. Use `scripts/push-github.sh` após commits locais para publicar no remoto `github`.

## License

MIT
