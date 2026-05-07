# MD04 — Junny Backend Local Server (NestJS)

# Objetivo

Este MD define:
- criação do backend local
- proxy server
- bypass de CORS
- arquitetura NestJS
- estrutura inicial dos módulos
- preparação para protocolos
- armazenamento local
- integração futura com frontend

---

# Objetivo do Backend

O backend local será responsável por:

- proxy de requests
- bypass de CORS
- execução REST
- execução SOAP
- execução GraphQL
- histórico
- collections
- environments
- autenticação futura
- websocket
- integração futura Kafka

---

# Stack

Utilizar:

- NestJS latest
- TypeScript
- SQLite
- Prisma ORM
- Axios
- WebSocket Gateway preparado

---

# Estrutura Inicial

```text
/apps/server
  /src
    /core
    /common
    /config
    /modules
    /protocols
```

---

# Estrutura Recomendada

## /core

Responsável por:
- providers globais
- interceptors
- filters
- guards
- pipes

---

## /common

Responsável por:
- interfaces
- helpers
- constants
- utils

---

## /config

Responsável por:
- envs
- database
- application config

---

## /modules

Responsável por:
- REST
- SOAP
- GraphQL
- collections
- history
- environments

---

## /protocols

Responsável por:
- abstrações de protocolos
- engines
- adapters
- clients

---

# Porta Inicial

Backend local:

```text
13050
```

---

# Fluxo Principal

```text
Frontend Angular
↓
NestJS Local Server
↓
APIs Externas
```

---

# Objetivo do Proxy

O proxy local resolverá:

- CORS
- autenticação
- headers customizados
- cookies
- certificados
- logging
- interceptação
- retries futuros

---

# Banco Inicial

Utilizar:
# SQLite

Objetivo:
- simplicidade
- zero setup
- ambiente local
- rapidez no MVP

---

# ORM

Utilizar:
# Prisma

---

# Estrutura Inicial do Banco

## Collections

```text
- id
- name
- description
- createdAt
```

---

## Requests

```text
- id
- method
- url
- headers
- body
- collectionId
- createdAt
```

---

## Environments

```text
- id
- name
- variables
- createdAt
```

---

## History

```text
- id
- request
- response
- status
- duration
- createdAt
```

---

# REST Module

Será o primeiro protocolo implementado.

Responsável por:

- GET
- POST
- PUT
- PATCH
- DELETE
- headers
- query params
- auth
- body

---

# GraphQL Module

Preparar estrutura para:

- query
- mutation
- variables
- headers

---

# SOAP Module

Preparar estrutura para:

- XML body
- SOAP envelope
- WSDL futuro
- headers XML

---

# WebSocket

Preparar gateway para:

- realtime
- logs futuros
- streaming
- monitoramento

---

# Kafka (Futuro)

Preparar arquitetura para:

- producers
- consumers
- topics
- events

Ainda NÃO implementar.

---

# Estrutura Inicial de Módulos

```text
/modules
  /rest
  /graphql
  /soap
  /history
  /collections
  /environments
```

---

# REST será prioridade

Fluxo:

1. REST
2. GraphQL
3. SOAP
4. WebSocket
5. Kafka

---

# Segurança

Preparar:

- validation pipes
- sanitização
- exception filters
- rate limit futuro

---

# Logging

Implementar logging simples inicialmente.

Preparar estrutura futura para:
- logs avançados
- debug
- tracing
- monitoramento

---

# Comunicação Frontend

Frontend deverá consumir:

```text
http://localhost:13050
```

---

# Estrutura de Resposta

Padronizar respostas:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

# Variáveis de Ambiente

Criar:

```text
.env
```

Exemplo:

```env
PORT=13050
DATABASE_URL=file:./dev.db
SECRET_KEY=9f4c2d8b7e61a3f5c0d9e8a1b6f74c3e2a5d9f0b7c1e4a8d6f3b2c9e1a7d5f8
```

---

# Swagger

Preparar Swagger interno para desenvolvimento.

Endpoint:

```text
/api/docs
```

---

# Objetivo do MVP Backend

Inicialmente entregar apenas:

- REST requests
- histórico
- collections
- environments
- proxy local
- SQLite
- Swagger

---

# NÃO implementar inicialmente

❌ IA
❌ autenticação complexa
❌ multiusuário
❌ Kafka
❌ plugins
❌ cloud sync
❌ analytics

---

# Objetivo do MD04

Entregar:

- backend NestJS configurado
- arquitetura backend base
- proxy local
- SQLite
- Prisma
- estrutura REST inicial
- base preparada para múltiplos protocolos
