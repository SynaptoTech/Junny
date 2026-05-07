# MD15 — Junny Docker + Development Environment

# Objetivo

Este MD define:
- ambiente docker
- docker compose
- setup desenvolvimento
- containers
- volumes
- ambiente local
- padronização setup
- fluxo desenvolvimento

---

# Objetivo Estratégico

O setup do Junny deverá ser:

- extremamente simples
- rápido
- contributor-friendly
- open source friendly

---

# Filosofia

Qualquer desenvolvedor deverá conseguir executar o projeto com:

```bash
docker compose up
```

---

# Estrutura Docker

Inicialmente:

```text
/apps
  /web
  /server

/docker
```

---

# Containers Iniciais

## Frontend

Angular application.

---

## Backend

NestJS local server.

---

## Database

SQLite inicialmente.

Sem container separado inicialmente.

---

# Docker Compose

Criar:

```text
docker-compose.yml
```

---

# Serviços

## web

Responsável por:
- Angular
- landing
- app frontend

Porta:

```text
12050
```

---

## server

Responsável por:
- NestJS
- proxy local
- REST
- GraphQL
- SOAP

Porta:

```text
13050
```

---

# Volumes

Persistir:

- SQLite
- node_modules opcionais
- cache futuro

---

# Estrutura Recomendada

```text
/docker
  /web
  /server
```

---

# Dockerfile Web

Objetivo:

- desenvolvimento
- hot reload
- build produção futuro

---

# Dockerfile Server

Objetivo:

- NestJS
- hot reload
- desenvolvimento local

---

# Environment Variables

Criar:

```text
.env
```

---

# Variáveis Iniciais

```env
WEB_PORT=12050
SERVER_PORT=13050
SECRET_KEY=9f4c2d8b7e61a3f5c0d9e8a1b6f74c3e2a5d9f0b7c1e4a8d6f3b2c9e1a7d5f8
```

---

# Objetivo do Ambiente

O ambiente deverá:

- funcionar no Linux
- funcionar no Mac
- funcionar no Windows (Docker Desktop)

---

# Hot Reload

Habilitar:

- Angular reload
- NestJS reload

---

# Build Futuro

Preparar arquitetura para:

- build produção
- nginx
- static frontend
- backend standalone

---

# Estrutura Compose

Exemplo esperado:

```yaml
services:
  web:
  server:
```

---

# Networks

Criar network interna:

```text
junny-network
```

---

# Comunicação

Frontend deverá consumir:

```text
http://server:13050
```

internamente.

---

# Ports Externas

## Frontend

```text
12050
```

---

## Backend

```text
13050
```

---

# Logs

Containers deverão possuir:

- logs limpos
- logs coloridos
- fácil debug

---

# Objetivo Open Source

O ambiente deverá:
- facilitar contribuição
- reduzir setup manual
- acelerar onboarding

---

# Scripts

Adicionar scripts:

```bash
docker compose up
docker compose down
docker compose logs
```

---

# README

Atualizar README com:

## Setup

```bash
git clone
docker compose up
```

---

# Git Ignore

Garantir:

```text
node_modules
dist
coverage
.env
```

---

# Persistência SQLite

Salvar banco localmente:

```text
/data
```

---

# Estrutura Recomendada

```text
/data
```

não deverá subir para GitHub.

---

# Desenvolvimento Local sem Docker

Também deverá funcionar:

## Frontend

```bash
npm install
npm run start
```

---

## Backend

```bash
npm install
npm run start:dev
```

---

# Objetivo Estratégico

Docker deverá:
- simplificar setup
- padronizar ambiente
- facilitar CI/CD futuro

---

# CI/CD Futuro

Preparar arquitetura para:

- GitHub Actions
- Gitea Actions
- Docker Registry
- Releases

---

# NÃO implementar inicialmente

❌ Kubernetes
❌ Helm
❌ Observabilidade
❌ Redis
❌ PostgreSQL obrigatório

---

# Futuro

Preparar arquitetura para:

- PostgreSQL
- Redis
- nginx
- cloud sync
- multi-container avançado

---

# Objetivo do MD15

Entregar:

- ambiente docker funcional
- docker compose
- frontend container
- backend container
- setup open source simples
- onboarding rápido para contributors
