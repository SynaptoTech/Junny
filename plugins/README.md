# Plugins (MD19)

This folder holds **bundled plugin layouts** (`plugin-name/` with `manifest.json`). There is **no dynamic loader or marketplace yet** — only architecture and examples.

Structure (future):

```text
plugins/
  <plugin-name>/
    manifest.json
    ... (runtime entry bundled with the host when shipped)
```

Use `@junny/plugin-sdk` in application code for TypeScript manifests and lifecycle typings.
