# MD28 — Junny Native Desktop Strategy (Tauri Roadmap)

# Objetivo

Este MD define:
- estratégia desktop
- Tauri roadmap
- distribuição desktop
- arquitetura híbrida
- empacotamento
- offline strategy
- desktop UX

---

# IMPORTANTE

Inicialmente:
# Junny será web-first

Porém:
# preparado para desktop desde o início

---

# Objetivo Estratégico

A versão desktop permitirá:

- melhor performance
- integração sistema operacional
- uso offline avançado
- secure storage
- experiência premium

---

# Estratégia Oficial

## Web-first

Primeira prioridade:
- browser
- localhost
- open source rápido

---

## Desktop-second

Após estabilidade:
- Tauri
- builds desktop
- installers

---

# Motivos para Tauri

Tauri oferece:

- menor consumo RAM
- menor tamanho aplicação
- melhor performance
- Rust backend possível futuro
- melhor segurança

---

# NÃO utilizar inicialmente

❌ Electron

---

# Objetivo Desktop

Permitir:

- execução local
- secure storage
- filesystem access
- certificates
- offline mode
- melhor performance

---

# Plataformas Futuras

Suportar:

- Windows
- Linux
- macOS

---

# Estrutura Planejada

```text
/apps/desktop
```

---

# Arquitetura

```text
Frontend Angular
↓
Tauri Shell
↓
Local Runtime
```

---

# Runtime Local

Desktop poderá futuramente:

- iniciar backend automaticamente
- gerenciar runtime local
- gerenciar database local

---

# Objetivo Estratégico

Usuário deverá:
# abrir Junny como ferramenta nativa

---

# Distribuição

Preparar arquitetura futura para:

- .exe
- .dmg
- .deb
- .AppImage

---

# Auto Update

Preparar arquitetura futura para:

- auto updates
- releases
- update channels

Ainda NÃO implementar.

---

# Secure Storage

Desktop permitirá futuramente:

- OS keychain
- encrypted secrets
- secure vault

---

# Filesystem Access

Preparar arquitetura para:

- import/export arquivos
- protobuf local
- collections locais
- certificates locais

---

# Objetivo Estratégico

Desktop deverá:
# parecer aplicação profissional moderna

---

# Deep Linking

Preparar arquitetura futura para:

```text
junny://
```

---

# Offline First

Desktop deverá:
# funcionar totalmente offline

---

# Performance

Desktop deverá:

- iniciar rapidamente
- baixo consumo memória
- baixo consumo CPU

---

# Tema

Seguir:
# dark-first

Mesmo padrão sistema.

---

# Estrutura Frontend

Frontend deverá:
- continuar reutilizável
- sem dependência browser-only

---

# Tauri Commands

Preparar arquitetura futura para:

- filesystem
- secrets
- OS integrations

---

# Segurança

Desktop deverá:
- isolar runtime
- proteger secrets
- evitar exposição local

---

# Objetivo Estratégico

Desktop será:
# diferencial forte contra ferramentas web-only

---

# Sync Strategy

Desktop deverá integrar futuramente com:

- local-first
- sync opcional
- backups locais

---

# Plugin System

Preparar compatibilidade futura com:

- plugins desktop
- runtime local
- plugins sistema

---

# Packaging

Preparar pipeline futura para:

- builds automáticas
- releases GitHub
- installers

---

# NÃO implementar inicialmente

❌ mobile app
❌ Electron
❌ marketplace desktop
❌ cloud-only mode

---

# Futuro

Preparar arquitetura para:

- desktop plugins
- native notifications
- tray icon
- filesystem watchers

---

# Objetivo do MVP Desktop

Entregar futuramente:

- app desktop Tauri
- runtime local
- installers
- secure storage

---

# Objetivo do MD28

Definir:

- desktop strategy
- Tauri roadmap
- offline strategy
- arquitetura híbrida futura do Junny
