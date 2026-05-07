---
title: WebSocket
description: WS/WSS connections, handshake headers, and realtime messages.
---

# WebSocket

The WebSocket workspace opens a **persistent connection** to `ws:` or `wss:` URLs so you can inspect handshake headers and exchange messages in **real time**.

## Connection

- Use **`ws://`** or **`wss://`** in the URL bar.  
- Configure **subprotocols** and extra **handshake headers** when the server requires them.  
- Watch **incoming** and **outgoing** frames in the stream panel.  

## Security

Prefer **`wss://`** on public networks. Certificate issues are surfaced clearly when TLS fails.

## Collections & history

Stored WebSocket definitions live next to REST/GraphQL/SOAP entries where supported — see [Collections](/collections/).

## Related

- [REST workspace](/rest/) — shared UX patterns (tabs, environments)  
