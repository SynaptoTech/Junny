# Mock payloads

Stable JSON/XML fixtures for integration tests and local mocks (predictable CI).

| File | Use |
|------|-----|
| `rest-httpbingo.json` | Sample REST JSON response shape |
| `graphql-get-repo.graphql` | Minimal GraphQL query string |
| `soap-envelope.xml` | Minimal SOAP envelope placeholder |

Wire these into HTTP mocks (MSW, nock, or test servers) as the suite grows.
