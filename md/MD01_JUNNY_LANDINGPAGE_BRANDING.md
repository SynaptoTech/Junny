# MD01 — Junny Landing Page + Branding + Estrutura Inicial

## Projeto

Nome oficial:
# Junny

Domínio principal:
# https://junny.dev.br

GitHub:
# https://github.com/SynaptoTech/Junny

Descrição oficial:
> Open Integration Studio for REST, SOAP, GraphQL, Kafka and beyond.

---

# Objetivo do Projeto

Junny será uma plataforma open source moderna focada em integração e testes de protocolos para desenvolvedores.

O projeto inicialmente será web-first e open source desde o início.

A proposta NÃO é ser apenas um clone do Postman.

O objetivo é criar uma plataforma moderna de integração capaz de trabalhar futuramente com:

- REST
- SOAP
- GraphQL
- Kafka
- WebSocket
- gRPC
- MQTT

Além de futuramente suportar:
- automações
- mock servers
- collections
- environments
- runners
- IA integrada
- workspaces
- plugins

---

# Estratégia Inicial

## Importante

O projeto será:
- open source
- MIT
- GitHub-first
- web-first
- dark-mode-first

O foco inicial NÃO será monetização.

O objetivo da primeira fase é:
- branding
- comunidade
- adoção
- GitHub stars
- autoridade técnica
- construção de ecossistema

---

# Estrutura de Repositórios

## GitHub Público

Repositório open source:

```text
github.com/SynaptoTech/Junny
```

Responsável por:
- código open source
- landing page
- documentação
- issues
- discussions
- releases
- roadmap público

---

## Gitea Privado (Synapto)

Repositório privado interno:

```text
git.synapto.com.br
```

Responsável por:
- pipelines privadas
- deploy
- secrets
- infraestrutura
- automações internas
- docker produção
- nginx
- observabilidade

---

# Estrutura Privada NÃO enviada ao GitHub

As seguintes estruturas NÃO devem ser enviadas para o GitHub público:

```text
.gitea/
md/
infra/
coverage/
images/
```

Essas pastas existirão apenas no repositório privado da Synapto.

---

# Pipeline Privada

A estrutura `.gitea/` será utilizada apenas internamente.

Ela será responsável por:
- build
- testes
- deploy
- docker
- publicação
- sincronização
- automações

Essa estrutura NÃO deve existir no GitHub público.

---

# Stack Inicial

## Frontend

- Angular
- TailwindCSS
- TypeScript
- Angular Signals
- SSR-ready

---

## Backend Local

- NestJS
- TypeScript

---

# Branding

## Nome

Utilizar sempre:
# junny

Preferencialmente lowercase.

---

# Slogan Oficial

## Principal
> Open Integration Studio

---

# Landing Page

## Hero Section

Conteúdo:
- logo
- slogan
- descrição curta
- CTA GitHub
- CTA Documentation
- preview da interface

---

# README Inicial

Criar README.md inicial contendo:

```md
# Junny

Open Integration Studio for REST, SOAP, GraphQL, Kafka and beyond.

## Features
- REST
- SOAP
- GraphQL
- Kafka (planned)
- OpenAPI/Swagger
- Collections
- Environments
- Developer-first experience

## Status
Early development 🚧

## Website
https://junny.dev.br

## License
MIT
```

---

# LICENSE

Criar também na raiz do projeto:

```text
LICENSE
```

Utilizar:
# MIT License

---

# SECRET_KEY Inicial

```text
9f4c2d8b7e61a3f5c0d9e8a1b6f74c3e2a5d9f0b7c1e4a8d6f3b2c9e1a7d5f8
```

---

# Objetivo do MD01

Entregar:
- branding inicial
- landing page moderna
- README inicial
- LICENSE
- estrutura inicial do projeto
- separação GitHub/Gitea
- estratégia open source
