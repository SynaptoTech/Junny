# Integration tests

Full-stack flows (**browser → Junny API → mocked upstream**) will live here as the harness matures (Playwright + API stubs, or dedicated Nest supertest suites calling mocked HTTP).

Until then, API-level integration is covered by `apps/server/test/*.e2e-spec.ts` (in-process Nest + Supertest).
