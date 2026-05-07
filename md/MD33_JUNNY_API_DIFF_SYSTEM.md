# MD33 — Junny API Diff System

# Objetivo

Este MD define:
- API diff
- schema compare
- response compare
- breaking changes
- version comparison
- visual diff
- governança APIs

---

# Objetivo Estratégico

O API Diff System poderá transformar o Junny em:

# ferramenta moderna de evolução APIs

---

# Objetivo do Diff System

Permitir futuramente:

- comparar OpenAPI schemas
- comparar GraphQL schemas
- comparar responses
- detectar breaking changes
- visualizar diferenças

---

# Casos de Uso

API Diff será útil para:

- CI/CD
- QA
- backend teams
- governance
- versionamento APIs

---

# Tipos de Diff

## OpenAPI

Comparar:
- endpoints
- request bodies
- response bodies
- status codes

---

## GraphQL

Comparar:
- types
- fields
- queries
- mutations

---

## Responses

Comparar:
- payloads
- status
- headers

---

# Fluxo Principal

Usuário:

1. seleciona schema A
2. seleciona schema B
3. executa compare
4. visualiza diferenças

---

# Estrutura Visual

```text
Schema A
vs
Schema B
```

---

# Visual Diff

Exibir:

- added
- removed
- modified

---

# Status Visual

## Added
Verde

## Modified
Amarelo

## Removed
Vermelho

---

# Breaking Changes

Detectar:

- endpoint removido
- campo removido
- tipo alterado
- response incompatível

---

# Objetivo Estratégico

Permitir:
# evolução APIs com segurança

---

# Estrutura Backend

Criar módulo:

```text
/modules/diff
```

---

# Estrutura Recomendada

```text
/modules/diff
  /comparators
  /schemas
  /reports
```

---

# Estrutura Frontend

```text
/features/diff
```

---

# Componentes Necessários

Criar futuramente:

- DiffViewer
- SchemaComparator
- BreakingChangesPanel
- ResponseCompare

---

# OpenAPI Compare

Comparar:

- paths
- methods
- request schema
- response schema

---

# GraphQL Compare

Comparar:

- types
- fields
- enums
- queries
- mutations

---

# Response Diff

Comparar:

```json
before
after
```

---

# Objetivo Estratégico

API Diff poderá:
# reduzir falhas produção

---

# Reports

Preparar arquitetura futura para:

- export reports
- markdown reports
- CI reports

---

# Runner Integration

Preparar integração futura com:

- Request Runner
- contract validation

---

# CI/CD Futuro

Preparar arquitetura para:

- automated diff checks
- GitHub validation
- pipeline blocking

---

# Visual UX

Diff Viewer deverá:
- ser extremamente claro
- fácil leitura
- moderno

---

# Tema

Seguir:
# dark-first

Mesmo padrão sistema.

---

# Performance

Comparação deverá:
- ser rápida
- incremental futura
- eficiente

---

# Enterprise Futuro

Preparar arquitetura para:

- governance dashboards
- approval workflows
- API lifecycle

---

# Objetivo Estratégico

API Diff será:
# feature enterprise premium

---

# NÃO implementar inicialmente

❌ realtime governance
❌ AI diff explanation
❌ distributed compare
❌ approval engine

---

# Futuro

Preparar arquitetura para:

- Git integrations
- PR diff comments
- schema history
- AI breaking analysis

---

# Objetivo do MVP Diff

Entregar futuramente:

- OpenAPI compare
- GraphQL compare
- response diff
- breaking changes detection

---

# Objetivo do MD33

Definir:

- API diff strategy
- schema comparison
- breaking change detection
- governança evolução APIs do Junny
