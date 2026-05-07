---
title: SOAP
description: XML envelopes, SOAP headers, and responses in Junny.
---

# SOAP

SOAP requests are built from **XML envelopes** — typically a body referencing your operation and optional **SOAP headers** for WS-* concerns.

## Workflow

1. Set the **endpoint URL** (often a `.asmx` or WSDL-bound service).  
2. Paste or edit the **XML envelope** in the body editor.  
3. Add **HTTP headers** (e.g. `Content-Type: text/xml; charset=utf-8`) as required by the service.  
4. Send and inspect the **XML response** with formatting in the viewer.  

## Collections

Store common SOAP calls in **collections** alongside REST and GraphQL for quick switching during integration work.

## Related

- [Environments](/environments/) — endpoint-specific URLs and secrets  
