# MD35 — Junny Browser Extension + Request Capture

# Objetivo

Este MD define:
- browser extension
- request capture
- fetch interception
- XHR interception
- GraphQL capture
- integração navegador
- produtividade frontend

---

# IMPORTANTE

Este módulo inicialmente será:
# roadmap arquitetural

---

# Objetivo Estratégico

A Browser Extension poderá transformar o Junny em:

# ferramenta integrada ao navegador

---

# Objetivo da Extension

Permitir futuramente:

- capturar requests browser
- interceptar fetch
- interceptar XHR
- visualizar GraphQL
- enviar requests para Junny

---

# Casos de Uso

A extensão será útil para:

- frontend developers
- debugging APIs
- GraphQL inspection
- reverse engineering frontend
- QA

---

# Objetivo Estratégico

Unificar:
- browser
- APIs
- debugging
- collections

em:
# único workflow

---

# Fluxo Principal

Usuário:

1. instala extensão
2. navega aplicação
3. extensão captura requests
4. envia para Junny local

---

# Capturas

Preparar suporte para:

- fetch
- XMLHttpRequest
- GraphQL requests
- headers
- responses

---

# Integração Local

Extension deverá comunicar com:

```text
localhost:13050
```

---

# Estrutura Visual

Adicionar:

```text
Captured Requests
```

---

# Fluxo UX

Usuário poderá:

- salvar request
- enviar para collection
- replay request
- gerar snippets

---

# Protocolos

Capturar:

- REST
- GraphQL

---

# Futuro

Preparar arquitetura para:

- WebSocket
- SSE
- gRPC-web

---

# Estrutura Extension

Preparar:

```text
/extensions/browser
```

---

# Browsers

Planejar suporte para:

- Chrome
- Edge
- Brave
- Firefox futuro

---

# Captura GraphQL

Detectar:

- operations
- queries
- mutations
- variables

---

# Request Inspector

Visualizar:

- method
- URL
- headers
- payload
- response

---

# Security

IMPORTANTE:

A extensão deverá:
- funcionar local-first
- sem cloud obrigatória
- sem telemetry invasiva

---

# Privacy

Usuário deverá controlar:

- domains monitorados
- enable/disable capture
- filters

---

# Filters

Preparar arquitetura para:

- ignore domains
- content-types
- regex filters

---

# Performance

Extension deverá:
- baixo overhead
- captura eficiente
- não impactar browser

---

# UX Requirements

A experiência deverá ser:

- extremamente simples
- rápida
- transparente

---

# Comunicação Local

Preparar arquitetura para:

- websocket local
- local API
- secure local communication

---

# Estrutura Frontend

```text
/features/browser-extension
```

---

# Componentes Planejados

Criar futuramente:

- CapturedRequestsPanel
- BrowserConnectionStatus
- RequestImporter
- GraphqlCaptureViewer

---

# Objetivo Estratégico

Extension poderá:
# aproximar Junny do workflow real frontend

---

# Integração Collections

Permitir:

```text
Captured Request
↓
Save Collection
```

---

# DevTools Future

Preparar arquitetura futura para:

- devtools integration
- inspect tabs
- response timelines

---

# NÃO implementar inicialmente

❌ cloud sync
❌ analytics agressivo
❌ session replay
❌ remote capture

---

# Futuro

Preparar arquitetura para:

- DevTools panel
- HAR capture
- performance waterfall
- mobile browser support

---

# Objetivo do MVP Extension

Entregar futuramente:

- capture fetch
- capture XHR
- import requests
- integração local

---

# Objetivo do MD35

Definir:

- browser extension strategy
- capture architecture
- integração navegador
- workflow frontend moderno do Junny
