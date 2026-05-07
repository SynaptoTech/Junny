---
title: REST workspace
description: HTTP methods, URL, headers, body, auth, and OpenAPI in Junny.
---

# REST

The REST workspace is the default surface for **HTTP/HTTPS** calls: pick a method, set the URL, edit headers, query parameters, and body, then send. Responses are shown with status, headers, and a formatted body.

## Core concepts

- **Request line** — method + URL (with environment variable placeholders where supported).  
- **Tabs** — params, headers, body, and auth are organized in a low-noise layout.  
- **OpenAPI import** — bring in operations from a spec to seed collections (see the app’s import flow).  
- **History** — recent calls are stored for replay and comparison (see server/history features).

## Collections

Group related REST calls into **collections** for repeat use and sharing across the project. See [Collections](/collections/) for how stored requests work across protocols.

## Environments

Use [Environments](/environments/) to switch base URLs, secrets, and variables without duplicating requests.

## Tips

- Prefer **clear variable names** in environments over hard-coded hosts.  
- Use the **response viewer** to copy JSON and status for bug reports.  

## Related

- [API & Swagger](/api/) — HTTP surface of the local backend (not the same as your target API, but useful for app features).  
