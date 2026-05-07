# MD10 — Junny History + Request Timeline System

# Objetivo

Este MD define:
- sistema de histórico
- timeline de requests
- replay requests
- persistência
- busca
- filtros
- organização temporal
- UX do histórico

---

# Objetivo do History System

O sistema de histórico deverá permitir:

- visualizar requests executadas
- repetir requests rapidamente
- analisar responses anteriores
- comparar resultados futuramente
- rastrear execuções

---

# Conceito

O histórico deverá funcionar como:

- timeline de atividade
- log inteligente
- workspace de produtividade

---

# Estrutura Visual

Adicionar painel:

```text
History
```

na sidebar principal.

---

# Estrutura Inicial

```text
Today
 ├── GET /users
 ├── POST /auth
 └── GET /products

Yesterday
 ├── GraphQL Query
 └── SOAP Request
```

---

# Informações Salvas

Cada histórico deverá armazenar:

- protocolo
- método
- URL
- headers
- body
- response
- status
- duration
- timestamp

---

# Persistência

Utilizar:
# SQLite

---

# Estrutura do Banco

## History

```text
- id
- protocol
- method
- url
- requestHeaders
- requestBody
- responseBody
- responseStatus
- duration
- createdAt
```

---

# Timeline Visual

Organizar por:

- Today
- Yesterday
- Last 7 Days
- Older

---

# Replay Request

Adicionar botão:

```text
Replay
```

---

# Objetivo do Replay

Permitir:

- repetir requests
- debug rápido
- produtividade
- testes rápidos

---

# Search

Adicionar busca:

```text
Search history...
```

---

# Filtros

Preparar filtros para:

- REST
- GraphQL
- SOAP
- status
- método

---

# UX Requirements

O histórico deverá ser:

- extremamente rápido
- organizado
- agradável
- útil para produtividade

---

# Visual dos Itens

Cada item deverá mostrar:

- método
- URL
- status
- duração
- horário

---

# Status Colors

## 2xx
Verde

## 3xx
Azul

## 4xx
Laranja

## 5xx
Vermelho

---

# Request Preview

Ao clicar no item:

- abrir request completa
- abrir response
- abrir tab nova

---

# Estrutura Frontend

```text
/features/history
```

---

# Componentes Necessários

Criar:

- HistorySidebar
- HistoryList
- HistoryItem
- HistoryFilters
- HistorySearch

---

# Persistência Local

Persistir:

- filtros
- busca
- última seleção

---

# Performance

Priorizar:

- paginação futura
- virtual scroll futuro
- render rápido
- poucos re-renders

---

# Limite Inicial

Inicialmente:
- salvar últimas 1000 requests

Preparar configuração futura.

---

# Limpeza

Adicionar:

```text
Clear History
```

---

# Confirmação

Antes de limpar:

```text
Are you sure?
```

---

# Histórico por Protocolo

Cada request deverá indicar:

- REST
- GraphQL
- SOAP
- WebSocket futuro
- Kafka futuro

---

# Objetivo Estratégico

O histórico será uma das features de produtividade mais importantes do Junny.

A UX deverá ser:
- extremamente rápida
- intuitiva
- moderna

---

# Futuro

Preparar arquitetura para:

- compare requests
- diff responses
- timeline avançada
- analytics
- replay automático

---

# NÃO implementar inicialmente

❌ analytics
❌ compare visual
❌ AI insights
❌ cloud sync

---

# Objetivo do MVP History

Entregar:

- histórico persistente
- replay requests
- timeline organizada
- busca
- filtros básicos

---

# Objetivo do MD10

Entregar:

- sistema de histórico
- timeline requests
- replay
- persistência SQLite
- produtividade avançada
- base de auditoria local do Junny
