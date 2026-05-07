# MD09 — Junny SOAP Workspace

# Objetivo

Este MD define:
- suporte SOAP
- XML editor
- SOAP requests
- SOAP envelopes
- WSDL parsing futuro
- response XML
- estrutura SOAP no backend
- UX SOAP moderna

---

# Objetivo do SOAP Module

O suporte SOAP deverá permitir:

- enviar XML
- editar SOAP envelopes
- headers SOAP
- visualizar XML response
- salvar requests
- reutilizar requests

---

# Importância do SOAP

SOAP ainda é amplamente utilizado em:

- bancos
- governo
- enterprise
- ERPs
- telecom
- sistemas legados

O Junny deverá possuir suporte SOAP moderno.

---

# Objetivo Estratégico

A maioria das ferramentas modernas:
- trata SOAP como secundário

O Junny deverá:
- tratar SOAP como protocolo de primeira classe

---

# Estrutura Visual

Adicionar protocolo:

```text
SOAP
```

na criação de requests.

---

# Fluxo Principal

Usuário:

1. cria request SOAP
2. define endpoint
3. escreve XML
4. executa request
5. visualiza XML response

---

# Layout

```text
------------------------------------------------
SOAP XML Editor
------------------------------------------------
Headers
------------------------------------------------
Response XML
------------------------------------------------
```

---

# XML Editor

Utilizar:
# Monaco Editor

Com:
- syntax highlight XML
- formatting futuro
- XML validation futura

---

# SOAP Body

Permitir edição completa:

```xml
<soapenv:Envelope>
  <soapenv:Header/>
  <soapenv:Body>
  </soapenv:Body>
</soapenv:Envelope>
```

---

# Request Headers

Permitir:

- SOAPAction
- Authorization
- custom headers
- content-type XML

---

# Response Viewer

Exibir:

- status
- duration
- XML response
- headers

---

# XML Beautify

Implementar:

- identação automática
- syntax highlight
- copy button

---

# Estrutura Backend

Criar módulo:

```text
/modules/soap
```

---

# Estrutura Recomendada

```text
/modules/soap
  /controllers
  /services
  /dto
```

---

# Payload Backend

```json
{
  "url": "https://api.example.com/soap",
  "headers": {},
  "xml": "<soapenv:Envelope>...</soapenv:Envelope>"
}
```

---

# Collections

SOAP requests deverão:
- ser salvas
- organizadas
- reutilizadas

---

# Environments

Suportar:

```text
{{baseUrl}}
{{token}}
```

---

# WSDL (Futuro)

Preparar arquitetura para:

- leitura WSDL
- geração automática requests
- discovery services
- autocomplete futuro

Ainda NÃO implementar.

---

# UX Requirements

A experiência SOAP deverá ser:

- limpa
- moderna
- simples
- agradável

Mesmo sendo XML.

---

# Tema

Seguir:
# dark-first

Mesmo padrão REST e GraphQL.

---

# Estrutura Frontend

```text
/features/soap
```

---

# Componentes Necessários

Criar:

- SoapEditor
- SoapToolbar
- SoapResponse
- XmlViewer
- HeaderTable

---

# Loading

Adicionar:

- loading elegante
- status visual
- feedback claro

---

# Tratamento de Erros

Exibir:

- SOAP Faults
- XML inválido
- network errors
- auth errors

---

# XML Formatting

Adicionar:
- beautify XML
- collapse future
- copy XML

---

# Objetivo do MVP SOAP

Entregar:

- requests SOAP
- XML editor
- XML response viewer
- collections
- environments

---

# NÃO implementar inicialmente

❌ WSDL completo
❌ autocomplete XML
❌ AI
❌ SOAP explorer
❌ validação avançada

---

# Futuro

Preparar arquitetura para:

- import WSDL
- explorer SOAP
- autocomplete XML
- geração automática envelopes

---

# Objetivo do MD09

Entregar:

- suporte SOAP moderno
- XML workspace
- XML response viewer
- integração com collections
- terceiro protocolo oficial do Junny
