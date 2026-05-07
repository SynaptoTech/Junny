# MD06 — Junny Collections + Environments System

# Objetivo

Este MD define:
- sistema de collections
- organização de requests
- environments
- variáveis globais
- persistência
- estrutura visual
- UX de organização

---

# Objetivo das Collections

As collections serão responsáveis por:

- organizar requests
- agrupar APIs
- separar projetos
- salvar workflows
- facilitar reutilização

---

# Conceito

Inspirado em:
- Postman
- Bruno
- Insomnia

Porém:
- mais moderno
- minimalista
- mais rápido
- local-first

---

# Estrutura Visual

## Sidebar Principal

A sidebar deverá conter:

```text
Collections
History
Environments
Protocols
```

---

# Collections

Cada collection poderá possuir:

- nome
- descrição
- cor futura
- requests
- folders futuros

---

# Estrutura Inicial

```text
Collection
 ├── Request 1
 ├── Request 2
 └── Request 3
```

---

# Requests Salvas

Cada request salva deverá armazenar:

- método
- URL
- headers
- query params
- body
- auth futura
- createdAt
- updatedAt

---

# UX das Collections

Permitir:

- criar
- editar
- deletar
- duplicar
- favoritar futuramente

---

# Persistência

Inicialmente:
- SQLite

---

# Estrutura do Banco

## Collections

```text
- id
- name
- description
- createdAt
- updatedAt
```

---

## Requests

```text
- id
- collectionId
- method
- url
- headers
- params
- body
- createdAt
- updatedAt
```

---

# Environments

## Objetivo

Permitir variáveis reutilizáveis:

```text
{{baseUrl}}
{{token}}
{{apiKey}}
```

---

# Estrutura Visual

```text
Environment
 ├── Variable
 ├── Variable
 └── Variable
```

---

# Estrutura do Banco

## Environments

```text
- id
- name
- createdAt
- updatedAt
```

---

## Environment Variables

```text
- id
- environmentId
- key
- value
```

---

# Fluxo de Variáveis

Exemplo:

Request:

```text
{{baseUrl}}/users
```

Resultado:

```text
https://api.example.com/users
```

---

# Resolução de Variáveis

O backend deverá:

1. receber request
2. resolver variables
3. substituir valores
4. executar request real

---

# Environment Selector

Adicionar seletor global:

```text
Development
Production
Local
```

---

# Objetivo dos Environments

Facilitar:

- troca de ambiente
- múltiplos servidores
- múltiplos tokens
- múltiplos projetos

---

# Estrutura Frontend

```text
/features/collections
/features/environments
```

---

# Componentes Necessários

## Collections

- CollectionsSidebar
- CollectionCard
- CollectionTree
- SaveRequestModal

---

## Environments

- EnvironmentSelector
- EnvironmentEditor
- VariableTable

---

# UX Requirements

O sistema deverá ser:

- extremamente rápido
- simples
- intuitivo
- agradável
- organizado

---

# Animações

Adicionar:
- expand/collapse suave
- hover elegante
- loading minimalista

---

# Persistência Local

Persistir:
- environment selecionado
- última collection aberta
- estado da sidebar

Inicialmente:
- localStorage

---

# Organização Visual

Collections deverão:
- possuir ícones
- possuir cores suaves futuras
- permitir expansão futura em folders

---

# Folders (Futuro)

Preparar arquitetura para:

```text
Collection
 ├── Auth
 ├── Users
 └── Payments
```

Ainda NÃO implementar.

---

# Exportação (Futuro)

Preparar arquitetura futura para:

- export JSON
- import JSON
- import Postman
- import Bruno

---

# Objetivo do MVP Collections

Entregar:

- collections simples
- salvar requests
- editar requests
- environments
- variables
- integração REST

---

# NÃO implementar inicialmente

❌ sync cloud
❌ colaboração
❌ compartilhamento
❌ RBAC
❌ versionamento

---

# Objetivo do MD06

Entregar:

- sistema de collections
- environments
- variables
- persistência SQLite
- organização visual
- base de produtividade do Junny
