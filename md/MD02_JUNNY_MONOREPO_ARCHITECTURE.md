# MD02 — Junny Monorepo + Arquitetura Base

# Objetivo

Este MD define:
- arquitetura inicial do projeto
- estrutura do monorepo
- organização dos apps
- separação frontend/backend
- padronização inicial
- estrutura preparada para crescimento futuro

---

# Visão Geral da Arquitetura

O projeto Junny será dividido inicialmente em:

```text
/apps
  /web
  /server
  /docs

/packages
  /core
  /sdk
  /ui
  /protocols

/examples
```

---

# Objetivo de cada Estrutura

## /apps/web

Responsável por:
- landing page
- interface principal
- dashboard
- requests
- collections
- environments
- autenticação futura
- workspace visual

Stack:
- Angular
- TailwindCSS
- TypeScript

---

## /apps/server

Responsável por:
- proxy local
- bypass de CORS
- integração REST
- integração SOAP
- integração GraphQL
- websocket
- futuras integrações Kafka
- autenticação local
- gerenciamento de variáveis

Stack:
- NestJS
- TypeScript

---

## /apps/docs

Responsável por:
- documentação
- guias
- changelog
- roadmap
- tutoriais
- contribuição open source

Inicialmente:
- VitePress
ou
- Docusaurus

---

# Packages Compartilhados

## /packages/core

Responsável por:
- tipos globais
- interfaces
- helpers
- abstrações
- engines compartilhadas

---

## /packages/sdk

Responsável por:
- SDK pública
- helpers externos
- integração futura
- automações

---

## /packages/ui

Responsável por:
- componentes compartilhados
- design system
- tema
- inputs
- botões
- modais
- tabelas

---

## /packages/protocols

Responsável por:
- REST engine
- SOAP engine
- GraphQL engine
- Kafka engine futura
- abstrações de protocolos

---

# Estratégia Frontend

## Angular

Utilizar:
- Angular latest
- standalone components
- Angular Signals
- lazy loading
- SSR-ready
- strict mode

---

# Estratégia Backend

## NestJS

Utilizar:
- módulos separados
- arquitetura limpa
- interceptors
- providers
- validation pipes
- exception filters
- websocket gateway preparado

---

# Estratégia de Comunicação

## Fluxo principal

```text
Frontend Angular
↓
NestJS Local Server
↓
APIs Externas
```

---

# Banco Inicial

Inicialmente:
- SQLite

Futuramente:
- PostgreSQL opcional

---

# Tema

O projeto será:
# dark-first

Inspirado em:
- Linear
- Raycast
- Vercel
- Supabase
- Bruno
- Hoppscotch

---

# Estado Global

Utilizar:
- Angular Signals

Evitar inicialmente:
- NgRx tradicional

---

# Estrutura Inicial Backend

```text
/modules
  /rest
  /soap
  /graphql
  /history
  /collections
  /environments
```

---

# REST será prioridade

Fluxo inicial:

1. REST
2. GraphQL
3. SOAP
4. WebSocket
5. Kafka

---

# Objetivo do MVP

Inicialmente focar apenas em:

- requests REST
- tabs
- collections
- environments
- history
- Swagger/OpenAPI
- dark mode
- ótima UX

---

# NÃO implementar inicialmente

❌ IA
❌ colaboração
❌ cloud sync
❌ autenticação complexa
❌ multiusuário
❌ plugins avançados

---

# Objetivo do MD02

Entregar:

- arquitetura inicial
- estrutura monorepo
- separação frontend/backend
- preparação para crescimento
- padronização inicial
- base técnica do projeto Junny
