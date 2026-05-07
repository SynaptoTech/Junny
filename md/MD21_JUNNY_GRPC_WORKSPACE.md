# MD21 — Junny gRPC Workspace

# Objetivo

Este MD define:
- suporte gRPC
- protobuf
- gRPC requests
- services explorer
- methods
- streaming
- arquitetura gRPC
- UX moderna para microservices

---

# Objetivo Estratégico

gRPC é extremamente utilizado em:

- microservices
- fintech
- big tech
- realtime systems
- backend distributed systems

O suporte gRPC transformará o Junny em:
# ferramenta moderna enterprise

---

# Objetivo do gRPC Module

Permitir futuramente:

- conectar serviços gRPC
- importar protobuf
- listar services
- listar methods
- executar requests
- visualizar responses
- streaming realtime

---

# Protocolos

Suportar:

```text
grpc://
grpcs://
```

---

# Estrutura Visual

Adicionar protocolo:

```text
gRPC
```

na criação de requests.

---

# Fluxo Principal

Usuário:

1. importa protobuf
2. conecta endpoint gRPC
3. escolhe service
4. escolhe method
5. envia payload
6. recebe response

---

# Estrutura Visual Planejada

```text
------------------------------------------------
Proto Explorer
------------------------------------------------
Request Payload
------------------------------------------------
Response Viewer
------------------------------------------------
```

---

# Proto Explorer

Visualizar:

- packages
- services
- methods
- messages

---

# Protobuf Import

Permitir:

```text
.proto
```

---

# Estrutura Protobuf

Detectar:

- services
- rpc methods
- request types
- response types

---

# Request Payload

Permitir envio:

```json
{
  "id": 1
}
```

---

# Response Viewer

Exibir:

- JSON response
- metadata
- status
- duration

---

# Streaming

Preparar arquitetura futura para:

- server streaming
- client streaming
- bidirectional streaming

---

# Estrutura Backend

Criar módulo:

```text
/modules/grpc
```

---

# Estrutura Recomendada

```text
/modules/grpc
  /services
  /clients
  /proto
```

---

# Biblioteca Recomendada

Avaliar:

- @grpc/grpc-js
- protobufjs

---

# Estrutura Frontend

```text
/features/grpc
```

---

# Componentes Necessários

Criar:

- ProtoExplorer
- GrpcMethodSelector
- GrpcPayloadEditor
- GrpcResponseViewer
- GrpcToolbar

---

# Collections

Permitir salvar:

- services
- methods
- payloads
- metadata

---

# Environments

Permitir:

```text
{{grpcHost}}
{{token}}
```

---

# Metadata

Permitir:

- auth headers
- custom metadata
- tokens

---

# UX Requirements

A experiência gRPC deverá ser:

- moderna
- extremamente limpa
- simples
- poderosa

---

# Tema

Seguir:
# dark-first

Mesmo padrão do sistema.

---

# Streaming Viewer

Preparar viewer realtime para:
- streams
- events
- mensagens contínuas

---

# Performance

Priorizar:

- baixo consumo memória
- render eficiente
- parsing rápido protobuf

---

# Segurança

Preparar arquitetura para:

- TLS
- certificates
- auth metadata

---

# Objetivo Estratégico

gRPC será:
# diferencial enterprise do Junny

---

# Futuro

Preparar arquitetura para:

- proto registry
- schema cache
- autocomplete
- reflection API

---

# Reflection API

Preparar suporte futuro para:

- descoberta automática services
- geração dinâmica methods

---

# NÃO implementar inicialmente

❌ grpc-web
❌ proto marketplace
❌ AI grpc generation
❌ observabilidade grpc

---

# Objetivo do MVP gRPC

Entregar:

- import protobuf
- service explorer
- method execution
- payload editor
- response viewer

---

# Objetivo do MD21

Definir:

- arquitetura gRPC
- protobuf strategy
- gRPC UX
- suporte enterprise moderno do Junny
