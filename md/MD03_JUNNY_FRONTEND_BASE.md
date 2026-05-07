# MD03 — Junny Frontend Base (Angular + Tailwind)

# Objetivo

Este MD define:
- criação da aplicação frontend
- configuração Angular
- TailwindCSS
- dark mode
- estrutura visual inicial
- arquitetura frontend
- layout base
- preparação da landing page

---

# Stack Frontend

Utilizar:

- Angular latest
- TypeScript
- TailwindCSS
- Angular Signals
- Standalone Components
- SSR-ready
- ESLint
- Prettier

---

# Objetivo do Frontend

O frontend deverá:

- parecer moderno
- extremamente rápido
- minimalista
- dark-first
- developer-first
- internacional
- responsivo
- preparado para evolução futura

---

# Inspirações Visuais

Utilizar como referência:

- Linear
- Raycast
- Supabase
- Vercel
- Bruno
- Hoppscotch

---

# Estrutura Inicial

```text
/apps/web
  /src
    /app
      /core
      /layout
      /shared
      /features
      /pages
      /services

    /assets
    /styles
```

---

# Estrutura Recomendada

## /core

Responsável por:
- providers
- interceptors
- configurações globais
- constants
- environments

---

## /layout

Responsável por:
- header
- footer
- containers
- sidebar futura

---

## /shared

Responsável por:
- componentes reutilizáveis
- directives
- pipes
- ui components

---

## /features

Responsável por:
- requests
- collections
- environments
- protocols
- settings

---

## /pages

Responsável por:
- landing
- docs futuras
- páginas públicas

---

# TailwindCSS

Configurar:

- dark mode
- cores customizadas
- spacing system
- animations leves
- gradients suaves

---

# Paleta Oficial

## Roxo

```css
#7C3AED
```

## Azul

```css
#2563EB
```

## Fundo principal

```css
#0F172A
```

---

# Tipografia

Utilizar:

- Inter
ou
- Geist

---

# Tema

A aplicação nascerá:
# dark-first

Preparar suporte futuro:
- light mode
- system theme

---

# Estrutura Visual Inicial

## Header

Deve conter:

- logo Junny
- GitHub button
- Documentation button
- Theme toggle (futuro)

---

## Hero Section

Conteúdo:

- slogan
- descrição
- CTAs
- preview da aplicação
- protocolos suportados

---

## Protocol Cards

Cards para:

- REST
- SOAP
- GraphQL
- Kafka
- WebSocket
- gRPC (coming soon)

---

# Componentes Iniciais

Criar componentes reutilizáveis:

- Button
- Card
- Section
- Hero
- Navbar
- Footer
- Badge
- ProtocolCard

---

# Responsividade

Prioridade:

1. Desktop
2. Mobile moderno

Garantir:
- ótima experiência mobile
- animações leves
- boa leitura
- spacing correto

---

# Landing Page

## Objetivo

A landing deve parecer:

- produto internacional
- ferramenta premium
- open source moderna
- extremamente limpa

---

# CTA Principal

Botão principal:

```text
View on GitHub
```

---

# CTA Secundário

```text
Documentation
```

---

# Footer

Adicionar:

- GitHub
- License
- Website
- Synapto

Texto:

```text
Built with ❤️ by Synapto
```

---

# SEO

Configurar:

- title
- description
- OpenGraph
- Twitter cards
- favicon
- sitemap
- robots.txt

---

# Performance

Priorizar:

- lazy loading
- imagens otimizadas
- poucos scripts
- Lighthouse alto
- bundle pequeno

---

# Estrutura de Rotas

Inicialmente:

```text
/
```

Futuras:

```text
/docs
/app
/settings
```

---

# Estado Global

Utilizar:
- Angular Signals

Evitar:
- NgRx tradicional inicialmente

---

# Objetivo do MD03

Entregar:

- frontend Angular configurado
- Tailwind configurado
- estrutura frontend base
- dark mode inicial
- landing page preparada
- componentes reutilizáveis
- base visual oficial do Junny
