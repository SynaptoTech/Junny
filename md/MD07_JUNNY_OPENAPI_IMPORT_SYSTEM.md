# MD07 — Junny Swagger/OpenAPI Import System

# Objetivo

Este MD define:
- importação Swagger/OpenAPI
- geração automática de requests
- parser OpenAPI
- estrutura visual
- integração com collections
- geração automática de endpoints

---

# Objetivo do Sistema

O sistema de importação deverá permitir:

- importar APIs rapidamente
- gerar collections automaticamente
- acelerar onboarding
- facilitar testes
- reduzir trabalho manual

---

# Fluxo Principal

Usuário informa:

```text
https://api.example.com/swagger.json
```

ou:

```text
https://api.example.com/v3/api-docs
```

Junny deverá:

1. baixar spec OpenAPI
2. interpretar schema
3. gerar collection
4. gerar requests
5. organizar endpoints automaticamente

---

# Formatos Suportados

## Inicialmente

- OpenAPI 3.x
- Swagger 2.0

---

# Futuramente

- Postman collections
- Bruno collections
- Insomnia exports

---

# Estrutura Gerada

```text
Collection
 ├── Auth
 ├── Users
 ├── Payments
 └── Products
```

---

# Organização Automática

O parser deverá:

- agrupar por tags
- separar métodos
- identificar auth
- detectar baseUrl
- detectar schemas

---

# Requests Geradas

Cada request deverá conter:

- método
- URL
- headers
- body exemplo
- query params
- path params

---

# Variáveis Automáticas

Criar automaticamente:

```text
{{baseUrl}}
```

---

# Auth Detection

Detectar automaticamente:

- Bearer Token
- API Key
- Basic Auth

---

# Estrutura Visual

Adicionar:

```text
Import OpenAPI
```

na sidebar ou header principal.

---

# Fluxo Visual

Usuário:

1. clica Import
2. cola URL
3. importa
4. collection aparece automaticamente

---

# UI Necessária

Criar:

- ImportModal
- OpenApiImporter
- ImportProgress
- CollectionPreview

---

# Parser Backend

Criar módulo:

```text
/modules/openapi
```

---

# Objetivo do Parser

Interpretar:

- paths
- methods
- requestBody
- parameters
- tags
- security
- servers

---

# Estrutura Backend

```text
/modules/openapi
  /services
  /parsers
  /dto
```

---

# Estratégia Inicial

Utilizar bibliotecas prontas para:

- parsing OpenAPI
- validação schema

Evitar parser manual inicialmente.

---

# Integração com Collections

Após importação:

- collection deve ser salva
- requests devem ser persistidas
- environments devem ser gerados

---

# Base URL

Detectar:

```json
servers
```

e criar automaticamente:

```text
{{baseUrl}}
```

---

# Body Examples

Caso existam exemplos:

```json
example
examples
```

utilizar automaticamente.

---

# UX Requirements

A experiência deverá ser:

- extremamente rápida
- simples
- automática
- agradável

---

# Loading

Adicionar:

- progress visual
- loading elegante
- feedback claro

---

# Tratamento de Erros

Exibir:

- URL inválida
- OpenAPI inválido
- erro de conexão
- schema não suportado

---

# Objetivo do MVP OpenAPI

Entregar:

- import OpenAPI
- import Swagger
- geração automática de collections
- requests automáticas
- tags automáticas
- environments básicos

---

# NÃO implementar inicialmente

❌ geração de SDK
❌ mock server
❌ testes automáticos
❌ IA
❌ sync cloud

---

# Futuro

Preparar arquitetura para:

- import Postman
- import Bruno
- import Insomnia
- export OpenAPI
- export collections

---

# Objetivo do MD07

Entregar:

- sistema OpenAPI
- importação automática
- geração de collections
- geração de requests
- onboarding rápido para APIs
- feature altamente competitiva do Junny
