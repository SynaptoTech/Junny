# MD05 — Junny REST Engine + Request Workspace

# Objetivo

Este MD define:
- implementação inicial REST
- workspace principal
- requests tabs
- editor de requests
- response viewer
- histórico
- UX principal da aplicação

---

# Objetivo da Primeira Feature

A primeira grande funcionalidade do Junny será:

# REST Request Workspace

Essa feature será o núcleo inicial da aplicação.

---

# Fluxo Inicial

Usuário:

1. cria request
2. escolhe método
3. define URL
4. adiciona headers/body
5. executa request
6. visualiza response
7. salva em collections

---

# Estrutura Visual

## Workspace Principal

Layout inspirado em:
- Bruno
- Postman
- Insomnia
- Hoppscotch

Porém:
- mais moderno
- minimalista
- dark-first
- mais limpo

---

# Estrutura da Tela

```text
------------------------------------------------
Sidebar | Tabs | Request Editor
------------------------------------------------
Sidebar | Response Viewer
------------------------------------------------
```

---

# Sidebar

Responsável por:

- collections
- history
- environments
- protocolos futuros

---

# Request Tabs

Permitir:
- múltiplas tabs
- tabs persistidas
- troca rápida
- fechar tabs
- tabs não salvas

---

# Request Editor

## Campos principais

### Method

Dropdown:

- GET
- POST
- PUT
- PATCH
- DELETE

---

### URL

Input principal:

```text
https://api.example.com/users
```

---

### Headers

Tabela dinâmica:

```text
KEY | VALUE
```

---

### Query Params

Tabela dinâmica.

---

### Body

Suporte inicial:

- JSON
- Raw text

Futuro:
- XML
- FormData
- GraphQL

---

# Editor de Código

Utilizar:
# Monaco Editor

Objetivo:
- syntax highlight
- autocomplete futuro
- melhor UX

---

# Response Viewer

Exibir:

- status
- duration
- size
- headers
- response body

---

# Response Body

Formatar:

- JSON beautify
- syntax highlight
- copy button

---

# Status Visual

Utilizar cores:

## 2xx
Verde

## 3xx
Azul

## 4xx
Amarelo/Laranja

## 5xx
Vermelho

---

# Histórico

Salvar automaticamente:

- método
- URL
- status
- tempo
- response
- timestamp

---

# Collections

Permitir:

- criar collections
- salvar requests
- editar requests
- deletar requests

---

# Environments

Preparar estrutura para:

```text
{{baseUrl}}
{{token}}
```

Ainda simples inicialmente.

---

# Fluxo Frontend → Backend

```text
Angular
↓
NestJS Local Server
↓
API externa
```

---

# Endpoint Inicial Backend

```text
POST /api/rest/request
```

Payload:

```json
{
  "method": "GET",
  "url": "https://api.example.com/users",
  "headers": {},
  "params": {},
  "body": null
}
```

---

# Estrutura de Resposta

```json
{
  "success": true,
  "status": 200,
  "duration": 120,
  "headers": {},
  "data": {}
}
```

---

# UX Requirements

O workspace deve ser:

- extremamente rápido
- fluido
- limpo
- minimalista
- agradável para devs

---

# Animações

Adicionar:
- hover suaves
- transições leves
- loading elegante

Evitar exageros.

---

# Tema

## Dark-first

Inspirado em:
- Linear
- Raycast
- Bruno

---

# Estrutura de Componentes

```text
/features/requests
  /components
  /pages
  /services
  /store
```

---

# Componentes Necessários

Criar:

- RequestTabs
- RequestEditor
- ResponseViewer
- HeaderTable
- ParamsTable
- SidebarCollections
- HistoryPanel
- EnvironmentSelector

---

# Persistência

Persistir localmente:

- tabs abertas
- última request
- layout
- environments

Inicialmente:
- localStorage

---

# Responsividade

Prioridade:
- desktop

Mobile:
- funcional
- porém simplificado

---

# Performance

Priorizar:

- render rápido
- poucos re-renders
- lazy loading
- Angular Signals

---

# Objetivo do MVP REST

Entregar:

- requests REST funcionais
- tabs
- histórico
- collections
- response viewer
- dark mode
- ótima UX

---

# NÃO implementar inicialmente

❌ GraphQL
❌ SOAP
❌ Kafka
❌ IA
❌ colaboração
❌ plugins

---

# Objetivo do MD05

Entregar:

- primeiro workspace real do Junny
- engine REST inicial
- UX principal da plataforma
- base visual da aplicação
- núcleo funcional do MVP
