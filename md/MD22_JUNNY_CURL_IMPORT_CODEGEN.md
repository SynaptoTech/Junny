# MD22 — Junny Curl Import + Code Generator System

# Objetivo

Este MD define:
- import curl
- geração código
- snippets
- SDK snippets
- export requests
- produtividade developer
- integração multi linguagens

---

# Objetivo Estratégico

Essa feature deverá transformar o Junny em:

# ferramenta produtividade developer

e não apenas:
# API client

---

# Objetivo do Sistema

Permitir:

- importar curl
- gerar requests automaticamente
- exportar código
- gerar snippets
- acelerar integração APIs

---

# Curl Import

Usuário poderá colar:

```bash
curl -X POST https://api.example.com
```

---

# Junny deverá:

1. interpretar curl
2. detectar método
3. detectar URL
4. detectar headers
5. detectar body
6. gerar request visual

---

# Estrutura Visual

Adicionar botão:

```text
Import Curl
```

---

# Fluxo Visual

Usuário:

1. cola curl
2. clica import
3. request aparece pronta

---

# Parser Curl

Criar parser para:

- method
- URL
- headers
- body
- auth
- params

---

# Code Generator

Permitir gerar código para:

- Java
- TypeScript
- JavaScript
- Angular
- Node.js
- Python
- Go
- Rust
- cURL

---

# Objetivo Estratégico

Developers adoram:
- copiar código pronto
- acelerar integração
- evitar boilerplate

---

# Estrutura Visual

Adicionar aba:

```text
Generate Code
```

---

# Fluxo Visual

Usuário:

1. executa request
2. escolhe linguagem
3. copia snippet

---

# Snippets Iniciais

## Java

Utilizar:
- HttpClient
- OkHttp futuro

---

## Angular

Utilizar:
- HttpClient Angular

---

## Node.js

Utilizar:
- fetch
- axios futuro

---

## Python

Utilizar:
- requests

---

## Go

Utilizar:
- net/http

---

## Rust

Utilizar:
- reqwest

---

# Estrutura Frontend

```text
/features/codegen
```

---

# Componentes Necessários

Criar:

- CurlImporter
- CurlModal
- CodeGenerator
- LanguageSelector
- CodeViewer

---

# Monaco Editor

Utilizar:
# Monaco Editor

para visualizar snippets.

---

# Copy Button

Adicionar:

```text
Copy Code
```

---

# UX Requirements

A experiência deverá ser:

- extremamente rápida
- simples
- limpa
- agradável

---

# Collections

Permitir exportar código baseado:
- request atual
- request salva
- collection futura

---

# Estrutura Backend

Criar módulo:

```text
/modules/codegen
```

---

# Estrutura Recomendada

```text
/modules/codegen
  /generators
  /templates
```

---

# Templates

Cada linguagem deverá possuir:

- template isolado
- fácil manutenção
- expansão futura

---

# Futuro

Preparar arquitetura para:

- SDK generation
- OpenAPI SDK
- DTO generation
- API clients completos

---

# Code Formatting

Gerar código:
- limpo
- moderno
- atualizado

---

# Objetivo Estratégico

Os snippets deverão parecer:
# código senior

---

# Integração OpenAPI

Futuramente permitir:
- gerar SDKs
- gerar clients completos

---

# NÃO implementar inicialmente

❌ SDK completo
❌ package publishing
❌ AI codegen
❌ DTO generation avançada

---

# Futuro

Preparar arquitetura para:

- Kotlin
- Swift
- C#
- PHP
- Ruby

---

# Objetivo do MVP Curl + Codegen

Entregar:

- import curl
- geração requests
- snippets principais
- copy code
- integração frontend

---

# Objetivo do MD22

Definir:

- curl parser
- code generation
- snippets system
- produtividade developer do Junny
