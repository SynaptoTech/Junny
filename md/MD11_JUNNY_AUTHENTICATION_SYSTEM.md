# MD11 — Junny Authentication System

# Objetivo

Este MD define:
- sistema de autenticação de requests
- auth helpers
- Bearer Token
- API Key
- Basic Auth
- gerenciamento seguro
- UX de autenticação

---

# Objetivo do Auth System

O sistema deverá permitir:

- autenticação rápida
- reutilização de credenciais
- integração com environments
- produtividade
- segurança local

---

# Tipos de Auth Inicialmente

Implementar:

- No Auth
- Bearer Token
- Basic Auth
- API Key

---

# Futuramente

Preparar arquitetura para:

- OAuth2
- JWT helper
- AWS Signature
- NTLM
- custom auth

---

# Estrutura Visual

Adicionar aba:

```text
Authorization
```

na request.

---

# Fluxo Visual

Usuário:

1. seleciona tipo auth
2. preenche credenciais
3. request utiliza auth automaticamente

---

# No Auth

Modo padrão:

```text
No Authentication
```

---

# Bearer Token

Campos:

```text
Token
```

Resultado:

```http
Authorization: Bearer TOKEN
```

---

# Basic Auth

Campos:

```text
Username
Password
```

Resultado:

```http
Authorization: Basic XXXXX
```

---

# API Key

Permitir:

- Header
- Query Param

---

# Exemplo API Key

```http
x-api-key: XXXXX
```

---

# Estrutura Frontend

```text
/features/auth
```

---

# Componentes Necessários

Criar:

- AuthSelector
- BearerAuthForm
- BasicAuthForm
- ApiKeyForm

---

# Persistência

Salvar:

- auth da request
- auth da collection
- auth do environment

---

# Integração com Environments

Permitir:

```text
{{token}}
{{apiKey}}
```

---

# Estrutura do Banco

## Request Auth

```text
- id
- requestId
- type
- config
```

---

# Segurança

## IMPORTANTE

Credenciais:
- nunca devem sair da máquina
- armazenamento local apenas
- sem sync inicialmente

---

# Criptografia Local

Preparar arquitetura para:

- criptografia futura
- secure storage futuro

Inicialmente:
- armazenamento simples local

---

# UX Requirements

A autenticação deverá ser:

- extremamente simples
- rápida
- intuitiva

---

# Collections Auth

Permitir auth herdada:

```text
Collection Auth
 └── Requests utilizam automaticamente
```

---

# Request Override

Permitir request sobrescrever auth da collection.

---

# Visual Requirements

Auth deverá:

- parecer premium
- limpa
- organizada
- moderna

---

# Tema

Seguir:
# dark-first

Mesmo padrão do sistema.

---

# Backend

Backend deverá:

1. receber auth config
2. montar headers
3. executar request
4. proteger logs futuros

---

# Estrutura Backend

```text
/modules/auth
```

---

# Objetivo Estratégico

A experiência auth deverá ser:
- melhor que Postman
- mais limpa
- mais simples

---

# Futuro

Preparar arquitetura para:

- JWT decode
- JWT viewer
- OAuth2 flow
- refresh token
- auth templates

---

# NÃO implementar inicialmente

❌ OAuth2 completo
❌ login externo
❌ cloud sync
❌ criptografia avançada
❌ RBAC

---

# Objetivo do MVP Auth

Entregar:

- Bearer Token
- Basic Auth
- API Key
- integração collections
- integração environments

---

# Objetivo do MD11

Entregar:

- sistema auth inicial
- auth integrada ao REST/GraphQL/SOAP
- produtividade
- UX moderna
- base segura para protocolos do Junny
