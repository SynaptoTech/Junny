---
title: Collections
description: Organize stored requests across REST, GraphQL, SOAP, and WebSocket.
---

# Collections

**Collections** group saved requests so you can reopen, duplicate, and organize integration scenarios without starting from scratch each time.

## What gets stored

Depending on protocol, a stored item typically includes:

- URL / endpoint  
- Method or operation shape  
- Headers, params, body  
- Optional tags or labels  

## Workflow tips

- Name collections after **services** or **features** (e.g. `payments-api`, `oauth-flow`).  
- Duplicate entries when experimenting so you keep a known-good baseline.  
- Use environments so collections stay **portable** across dev/stage URLs.

## Cross-protocol

Collections are shared conceptually across REST, GraphQL, SOAP, and WebSocket — switch workspace tabs without losing your mental model of “what belongs together.”

## Related

- [Environments](/environments/) — variables that collections resolve against  
