# MD12 — Junny WebSocket Workspace

# Objetivo

Este MD define:
- suporte WebSocket
- ws/wss connections
- realtime messages
- connection manager
- message viewer
- event stream
- UX realtime

---

# Objetivo do WebSocket Module

O suporte WebSocket deverá permitir:

- conectar em endpoints ws/wss
- enviar mensagens
- receber eventos realtime
- visualizar streams
- testar eventos
- debug realtime

---

# Importância Estratégica

WebSocket é utilizado em:

- chats
- realtime systems
- trading
- games
- notificações
- dashboards
- streaming

O Junny deverá tratar realtime como feature importante.

---

# Protocolos

Suportar:

```text
ws://
wss://
```

---

# Estrutura Visual

Adicionar protocolo:

```text
WebSocket
```

na criação de requests.

---

# Fluxo Principal

Usuário:

1. cria conexão websocket
2. define endpoint
3. conecta
4. envia mensagens
5. recebe eventos realtime

---

# Layout

```text
------------------------------------------------
Connection Toolbar
------------------------------------------------
Messages Stream
------------------------------------------------
Send Message
------------------------------------------------
```

---

# Connection Toolbar

Exibir:

- status conexão
- connect/disconnect
- reconnect
- endpoint atual

---

# Status Visual

## Connected
Verde

## Connecting
Amarelo

## Disconnected
Cinza

## Error
Vermelho

---

# Messages Stream

Exibir mensagens:

- recebidas
- enviadas
- timestamps
- direction
- tamanho

---

# Estrutura Visual das Mensagens

```text
[12:00:01] RECEIVED
{
  "event": "message"
}
```

---

# Send Message

Permitir envio:

- JSON
- texto raw

---

# Monaco Editor

Utilizar:
# Monaco Editor

para envio de mensagens.

---

# Auto Scroll

Implementar:

- auto scroll realtime
- pause future
- clear messages

---

# Estrutura Backend

Criar módulo:

```text
/modules/websocket
```

---

# Estrutura Recomendada

```text
/modules/websocket
  /services
  /dto
  /gateways
```

---

# Payload Inicial

```json
{
  "url": "wss://example.com/socket"
}
```

---

# Collections

Permitir salvar:

- conexões websocket
- mensagens exemplo
- endpoints

---

# Environments

Permitir:

```text
{{wsUrl}}
{{token}}
```

---

# Auth

Preparar suporte para:

- headers
- bearer token
- query auth

---

# UX Requirements

A experiência realtime deverá ser:

- fluida
- rápida
- agradável
- limpa

---

# Tema

Seguir:
# dark-first

Mesmo padrão do sistema.

---

# Componentes Necessários

Criar:

- WebsocketToolbar
- MessageStream
- SendMessageEditor
- ConnectionStatus
- WebsocketSidebar

---

# Persistência

Salvar:

- endpoint
- mensagens recentes
- status futura

---

# Logs

Preparar arquitetura para:

- logs realtime
- export logs futuro
- filtering futuro

---

# Performance

Priorizar:

- stream eficiente
- render rápido
- virtual scroll futuro
- memória controlada

---

# Reconexão

Preparar arquitetura futura para:

- auto reconnect
- reconnect delay
- reconnect strategy

Ainda NÃO implementar completamente.

---

# Filtros Futuros

Preparar arquitetura para:

- filtrar eventos
- busca
- regex
- payload filter

---

# NÃO implementar inicialmente

❌ socket.io
❌ MQTT
❌ Kafka streams
❌ AI realtime
❌ analytics

---

# Objetivo do MVP WebSocket

Entregar:

- conexão ws/wss
- envio mensagens
- recebimento mensagens
- stream visual
- collections

---

# Futuro

Preparar arquitetura para:

- Socket.IO
- MQTT
- Kafka streams
- realtime monitoring
- event inspector

---

# Objetivo do MD12

Entregar:

- suporte WebSocket
- realtime workspace
- stream viewer
- conexão realtime
- quarto protocolo oficial do Junny
