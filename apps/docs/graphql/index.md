---
title: GraphQL
description: Queries, mutations, variables, and schema introspection in Junny.
---

# GraphQL

The GraphQL workspace lets you run **queries and mutations** against a GraphQL HTTP endpoint, manage **variables** as JSON, and use **introspection** when the server allows it.

## Editor

- Write the operation in the main editor.  
- Supply **variables** in a separate JSON object.  
- Reuse **collections** and **environments** like REST (see [Collections](/collections/) and [Environments](/environments/)).  

## Introspection

When enabled on the target server, introspection helps you discover the schema. If the server blocks introspection, paste known types and fields manually.

## UX principles

- Minimal chrome — focus on the operation text and variables.  
- Fast iteration — same history and replay concepts as REST where implemented.  

## Related

- [REST workspace](/rest/) — shared workspace patterns  
