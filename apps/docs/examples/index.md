---
title: Examples
description: Example snippets and flows — expand over time.
---

# Examples

This section hosts **copy-paste friendly** examples as the product stabilizes.

## REST — sample GET

```http
GET https://httpbingo.org/get HTTP/1.1
Accept: application/json
```

## Environment variables — conceptual

When variables are enabled for requests:

```text
{{base_url}}/v1/users
```

…with `base_url` defined in the active environment (see [Environments](/environments/)).

## WebSocket — sample echo

Many public echo servers exist for testing; point the WebSocket workspace at a `wss://` echo URL and send small JSON payloads to verify the stream.

## Tutorials (planned)

Per roadmap, dedicated tutorials will cover end-to-end flows for REST, GraphQL, SOAP, and WebSocket. Track progress on [Roadmap](/roadmap/).

## Contribute

Add focused examples via pull request — one example per use case keeps pages fast to read.
