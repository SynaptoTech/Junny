# MD36 — Junny AI Request Generator

# Objetivo

Este MD define:
- geração requests via IA
- AI prompt requests
- geração automática APIs
- geração GraphQL
- geração SOAP
- produtividade inteligente
- AI developer assistant

---

# IMPORTANTE

Inicialmente:
# IA será opcional

O núcleo do Junny continuará:
# totalmente funcional sem IA

---

# Objetivo Estratégico

O AI Request Generator poderá transformar o Junny em:

# plataforma inteligente de integração

---

# Objetivo do AI Generator

Permitir futuramente:

- gerar requests automaticamente
- gerar GraphQL queries
- gerar SOAP XML
- gerar auth headers
- gerar payloads
- acelerar onboarding APIs

---

# Fluxo Principal

Usuário escreve:

```text
Create a REST request for GitHub users API
```

---

# Junny deverá gerar:

- método
- URL
- headers
- query params
- body
- auth

---

# REST Generation

Exemplo:

```text
Create CRUD endpoints for users
```

---

# Resultado

```text
GET /users
POST /users
PUT /users/:id
DELETE /users/:id
```

---

# GraphQL Generation

Usuário escreve:

```text
Generate GraphQL login mutation
```

---

# Resultado

```graphql
mutation Login {
  login {
    token
  }
}
```

---

# SOAP Generation

Usuário escreve:

```text
Generate SOAP envelope for payment request
```

---

# Resultado

XML SOAP completo.

---

# Objetivo Estratégico

Reduzir:
- boilerplate
- setup manual
- onboarding APIs

---

# Estrutura Frontend

```text
/features/ai-generator
```

---

# Componentes Planejados

Criar futuramente:

- AIPromptInput
- RequestPreview
- AIResponsePanel
- GenerateButton

---

# Estrutura Backend

Criar módulo:

```text
/modules/ai-generator
```

---

# Estrutura Recomendada

```text
/modules/ai-generator
  /providers
  /prompts
  /services
```

---

# Providers Futuros

Preparar arquitetura para:

- OpenAI
- OpenRouter
- Ollama
- Anthropic
- local models

---

# IA Local

Preparar arquitetura para:

- Ollama
- llama.cpp
- GGUF models

---

# Objetivo Estratégico

Permitir:
# IA privada/local

---

# Prompt Templates

Criar templates futuros para:

- REST
- GraphQL
- SOAP
- auth
- payloads

---

# UX Requirements

A experiência deverá ser:

- extremamente simples
- rápida
- impressionante
- produtiva

---

# Privacy First

Usuário deverá controlar:

- provider IA
- prompts enviados
- local-only mode

---

# Collections Integration

Permitir:

```text
AI Request
↓
Save Collection
```

---

# AI Context

Preparar arquitetura futura para:

- OpenAPI context
- collection context
- environment context

---

# Objetivo Estratégico

IA deverá:
# aumentar produtividade real

e não:
# gimmick marketing

---

# Segurança

IMPORTANTE:

Nunca enviar automaticamente:
- tokens
- secrets
- passwords

---

# Local Models

Preparar arquitetura para:

- CPU-first
- local inference
- offline generation

---

# NÃO implementar inicialmente

❌ autonomous agents
❌ cloud mandatory AI
❌ telemetry prompts
❌ auto execution requests

---

# Futuro

Preparar arquitetura para:

- AI workflows
- AI debugging
- AI testing
- AI API explanation

---

# Objetivo do MVP AI Generator

Entregar futuramente:

- generate REST
- generate GraphQL
- generate SOAP
- AI prompt input

---

# Objetivo do MD36

Definir:

- AI generation strategy
- request generation architecture
- IA productivity roadmap
- integração inteligente futura do Junny
