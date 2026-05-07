import { INestApplication } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("App (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    app.enableCors({ origin: true, credentials: true });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /v1/health returns ok payload", async () => {
    const res = await request(app.getHttpServer())
      .get("/v1/health")
      .expect(200);

    expect(res.body).toMatchObject({
      service: "junny-api",
      status: expect.stringMatching(/^(ok|degraded)$/),
      database: expect.stringMatching(/^(ok|error)$/),
    });
  });

  it("GET /api/kafka/roadmap returns roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/kafka/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      libraryCandidate: "kafkajs",
      md: "MD13_JUNNY_KAFKA_WORKSPACE_ROADMAP.md",
    });
  });

  it("GET /api/plugins/roadmap returns architecture JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/plugins/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "architecture",
      md: "MD19_JUNNY_PLUGIN_SYSTEM_ARCHITECTURE.md",
      sdkPackage: "@junny/plugin-sdk",
    });
  });

  it("GET /api/ai/roadmap returns strategy JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/ai/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "strategy",
      md: "MD20_JUNNY_AI_INTEGRATION_STRATEGY.md",
      sdkPackage: "@junny/ai-sdk",
    });
  });

  it("GET /api/grpc/roadmap returns gRPC workspace JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/grpc/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD21_JUNNY_GRPC_WORKSPACE.md",
    });
    expect(res.body.libraryCandidates).toContain("@grpc/grpc-js");
  });

  it("GET /api/codegen/roadmap returns curl + codegen JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/codegen/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD22_JUNNY_CURL_IMPORT_CODEGEN.md",
    });
    expect(res.body.languagesMvp.length).toBeGreaterThan(0);
  });

  it("GET /api/runner/roadmap returns collection runner roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/runner/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD23_JUNNY_REQUEST_RUNNER.md",
    });
    expect(Array.isArray(res.body.mvpCapabilities)).toBe(true);
    expect(res.body.mvpCapabilities.length).toBeGreaterThan(0);
  });

  it("GET /api/mock/roadmap returns mock server system roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/mock/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD24_JUNNY_MOCK_SERVER_SYSTEM.md",
    });
    expect(res.body.defaultPort).toBe("14050");
    expect(Array.isArray(res.body.mvpCapabilities)).toBe(true);
    expect(res.body.mvpCapabilities.length).toBeGreaterThan(0);
  });

  it("GET /api/security/roadmap returns security + secrets architecture JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/security/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD25_JUNNY_SECURITY_SECRETS_ARCHITECTURE.md",
    });
    expect(Array.isArray(res.body.principles)).toBe(true);
    expect(res.body.principles.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.mvpCapabilities)).toBe(true);
  });

  it("GET /api/sync/roadmap returns sync + cloud strategy JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/sync/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      md: "MD26_JUNNY_SYNC_ARCHITECTURE_CLOUD_STRATEGY.md",
    });
    expect(res.body.phase).toBeTruthy();
    expect(Array.isArray(res.body.philosophies)).toBe(true);
    expect(Array.isArray(res.body.syncTargetsFuture)).toBe(true);
  });

  it("GET /api/workspace-layout/roadmap returns workspace layout system JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/workspace-layout/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD27_JUNNY_WORKSPACE_LAYOUT_SYSTEM.md",
      frontendStructure: "/features/workspace",
    });
    expect(Array.isArray(res.body.mvpCapabilities)).toBe(true);
    expect(res.body.mvpCapabilities.length).toBeGreaterThan(0);
  });

  it("GET /api/desktop/roadmap returns native desktop (Tauri) strategy JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/desktop/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD28_JUNNY_NATIVE_DESKTOP_STRATEGY.md",
      appStructure: "/apps/desktop",
    });
    expect(Array.isArray(res.body.strategy)).toBe(true);
    expect(res.body.strategy).toContain("web-first");
    expect(res.body.avoidInitially).toContain("electron");
  });

  it("GET /api/team/roadmap returns enterprise team workspaces roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/team/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD29_JUNNY_ENTERPRISE_TEAM_WORKSPACES.md",
      frontendStructure: "/features/team",
    });
    expect(Array.isArray(res.body.rolesFuture)).toBe(true);
    expect(res.body.rolesFuture).toContain("owner");
    expect(Array.isArray(res.body.workspaceModel)).toBe(true);
  });

  it("GET /api/official/roadmap returns official roadmap v1 JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/official/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "v1",
      md: "MD30_JUNNY_OFFICIAL_ROADMAP_V1.md",
      vision: "Open Integration Studio",
      frontendStructure: "/features/official",
    });
    expect(Array.isArray(res.body.phases)).toBe(true);
    expect(res.body.phases.length).toBe(8);
    expect(Array.isArray(res.body.philosophy)).toBe(true);
  });

  it("GET /api/monitoring/roadmap returns API monitoring roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/monitoring/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD31_JUNNY_API_MONITORING_SYSTEM.md",
      frontendStructure: "/features/monitoring",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("health checks");
    expect(Array.isArray(res.body.deferred)).toBe(true);
  });

  it("GET /api/contracts/roadmap returns contract testing roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/contracts/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD32_JUNNY_CONTRACT_TESTING_SCHEMA_VALIDATION.md",
      frontendStructure: "/features/contracts",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("OpenAPI validation");
    expect(Array.isArray(res.body.contractTypes)).toBe(true);
  });

  it("GET /api/diff/roadmap returns API diff system roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/diff/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD33_JUNNY_API_DIFF_SYSTEM.md",
      frontendStructure: "/features/diff",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("OpenAPI compare");
    expect(Array.isArray(res.body.visualDiffKinds)).toBe(true);
  });

  it("GET /api/interceptor/roadmap returns traffic interceptor roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/interceptor/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD34_JUNNY_TRAFFIC_INTERCEPTOR_HTTP_INSPECTOR.md",
      frontendStructure: "/features/interceptor",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("HTTP capture");
    expect(Array.isArray(res.body.inspirations)).toBe(true);
  });

  it("GET /api/browser-extension/roadmap returns browser extension roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/browser-extension/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD35_JUNNY_BROWSER_EXTENSION_REQUEST_CAPTURE.md",
      frontendStructure: "/features/browser-extension",
      localIntegrationHost: "localhost:13050",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("capture fetch");
    expect(Array.isArray(res.body.browsersPlanned)).toBe(true);
  });

  it("GET /api/ai-generator/roadmap returns AI request generator roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/ai-generator/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD36_JUNNY_AI_REQUEST_GENERATOR.md",
      frontendStructure: "/features/ai-generator",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("generate REST");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/ai-analyzer/roadmap returns AI response analyzer roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/ai-analyzer/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD37_JUNNY_AI_RESPONSE_ANALYZER.md",
      frontendStructure: "/features/ai-analyzer",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("analyze responses");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/workflows/roadmap returns AI workflow builder roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/workflows/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD38_JUNNY_AI_WORKFLOW_BUILDER.md",
      frontendStructure: "/features/workflows",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("request chaining");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/marketplace/roadmap returns plugin marketplace roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/marketplace/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD39_JUNNY_PLUGIN_MARKETPLACE.md",
      frontendStructure: "/features/marketplace",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("plugin discovery");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/enterprise/roadmap returns enterprise self-hosted roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/enterprise/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD40_JUNNY_ENTERPRISE_SELF_HOSTED_PLATFORM.md",
      frontendStructure: "/features/enterprise",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("self-hosted runtime");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/profiler/roadmap returns API performance profiler roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/profiler/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD41_JUNNY_API_PERFORMANCE_PROFILER.md",
      frontendStructure: "/features/profiler",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("waterfall");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/observability/roadmap returns realtime observability dashboard roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/observability/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD42_JUNNY_REALTIME_OBSERVABILITY_DASHBOARD.md",
      frontendStructure: "/features/observability",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("realtime metrics");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/vault/roadmap returns secrets vault enterprise roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/vault/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD43_JUNNY_SECRETS_VAULT_ENTERPRISE.md",
      frontendStructure: "/features/vault",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("encrypted secrets");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/ai-docs/roadmap returns AI API documentation generator roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/ai-docs/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD44_JUNNY_AI_API_DOCUMENTATION_GENERATOR.md",
      frontendStructure: "/features/ai-docs",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("markdown generation");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/ai-openapi/roadmap returns AI OpenAPI generator roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/ai-openapi/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD45_JUNNY_AI_OPENAPI_GENERATOR.md",
      frontendStructure: "/features/ai-openapi",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("YAML export");
    expect(Array.isArray(res.body.principles)).toBe(true);
  });

  it("GET /api/streaming/roadmap returns event streaming studio roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/streaming/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD46_JUNNY_EVENT_STREAMING_STUDIO.md",
      frontendStructure: "/features/streaming",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("realtime messages");
  });

  it("GET /api/git/roadmap returns git native collections roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/git/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD48_JUNNY_GIT_NATIVE_COLLECTIONS.md",
      frontendStructure: "/features/git",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("Git sync");
  });

  it("GET /api/public-api/roadmap returns public sdk developer platform roadmap JSON", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/public-api/roadmap")
      .expect(200);

    expect(res.body).toMatchObject({
      phase: "roadmap",
      md: "MD50_JUNNY_PUBLIC_SDK_DEVELOPER_PLATFORM.md",
      frontendStructure: "/features/sdk",
    });
    expect(Array.isArray(res.body.mvpGoals)).toBe(true);
    expect(res.body.mvpGoals).toContain("local SDK");
  });
});
