---
layout: home

title: Junny Documentation
titleTemplate: Open Integration Studio

hero:
  name: Junny
  text: Open Integration Studio
  tagline: REST, GraphQL, SOAP, WebSocket, and beyond — fast, local-first, developer-focused.
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started/
    - theme: alt
      text: Install
      link: /installation/
    - theme: alt
      text: GitHub
      link: https://github.com/SynaptoTech/Junny

features:
  - icon: 🚀
    title: Quick start
    details: Clone the repo and run docker compose up — or use npm workspaces locally.
  - icon: 📘
    title: Markdown-first docs
    details: Fast VitePress site with search, dark mode, and copy-friendly code blocks.
  - icon: 🗺️
    title: Clear roadmap
    details: See what is shipped today (REST → WebSocket) and what is planned next.
---

## Quick start

```bash
git clone https://github.com/SynaptoTech/Junny.git
cd Junny
docker compose up
```

Then open the **web UI** at `http://localhost:12050` and the **API** at `http://localhost:13050` (default dev ports).

## Next steps

- [Installation](/installation/) — Docker, env files, and local Node setup  
- [REST workspace](/rest/) — requests, tabs, and the response viewer  
- [API & Swagger](/api/) — OpenAPI description of the local NestJS API  
- [Guides hub](/workflows/) — workflows, monitoring, AI, enterprise, plugins, CLI, SDK  

Contributions to these docs are welcome via pull requests. See the repository [CONTRIBUTING](https://github.com/SynaptoTech/Junny/blob/main/.github/CONTRIBUTING.md) guide.
