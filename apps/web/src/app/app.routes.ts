import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingPageComponent),
  },
  /** MD58 — locale-prefixed landing (EN alias + PT-BR + ES); content i18n comes later */
  {
    path: 'en',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'pt-br',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'es',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./features/requests/pages/workspace/workspace.component').then(
        (m) => m.WorkspacePageComponent,
      ),
  },
  {
    path: 'app/graphql',
    loadComponent: () =>
      import('./features/graphql/pages/graphql-workspace/graphql-workspace.component').then(
        (m) => m.GraphqlWorkspacePageComponent,
      ),
  },
  {
    path: 'app/soap',
    loadComponent: () =>
      import('./features/soap/pages/soap-workspace/soap-workspace.component').then(
        (m) => m.SoapWorkspacePageComponent,
      ),
  },
  {
    path: 'app/websocket',
    loadComponent: () =>
      import('./features/websocket/pages/websocket-workspace/websocket-workspace.component').then(
        (m) => m.WebsocketWorkspacePageComponent,
      ),
  },
  {
    path: 'app/kafka',
    loadComponent: () =>
      import('./features/kafka/pages/kafka-roadmap/kafka-roadmap.component').then(
        (m) => m.KafkaRoadmapPageComponent,
      ),
  },
  {
    path: 'app/design-system',
    loadComponent: () =>
      import('./features/design-system/pages/design-system-page/design-system-page.component').then(
        (m) => m.DesignSystemPageComponent,
      ),
  },
  {
    path: 'app/plugins',
    loadComponent: () =>
      import('./features/plugins/pages/plugins-roadmap/plugins-roadmap.component').then(
        (m) => m.PluginsRoadmapPageComponent,
      ),
  },
  {
    path: 'app/ai',
    loadComponent: () =>
      import('./features/ai/pages/ai-roadmap/ai-roadmap.component').then(
        (m) => m.AiRoadmapPageComponent,
      ),
  },
  {
    path: 'app/grpc',
    loadComponent: () =>
      import('./features/grpc/pages/grpc-roadmap/grpc-roadmap.component').then(
        (m) => m.GrpcRoadmapPageComponent,
      ),
  },
  {
    path: 'app/codegen',
    loadComponent: () =>
      import('./features/codegen/pages/codegen-roadmap/codegen-roadmap.component').then(
        (m) => m.CodegenRoadmapPageComponent,
      ),
  },
  {
    path: 'app/runner',
    loadComponent: () =>
      import('./features/runner/pages/runner-roadmap/runner-roadmap.component').then(
        (m) => m.RunnerRoadmapPageComponent,
      ),
  },
  {
    path: 'app/mock',
    loadComponent: () =>
      import('./features/mock/pages/mock-roadmap/mock-roadmap.component').then(
        (m) => m.MockRoadmapPageComponent,
      ),
  },
  {
    path: 'app/security',
    loadComponent: () =>
      import('./features/security/pages/security-roadmap/security-roadmap.component').then(
        (m) => m.SecurityRoadmapPageComponent,
      ),
  },
  {
    path: 'app/sync',
    loadComponent: () =>
      import('./features/sync/pages/sync-roadmap/sync-roadmap.component').then(
        (m) => m.SyncRoadmapPageComponent,
      ),
  },
  {
    path: 'app/workspace-layout',
    loadComponent: () =>
      import('./features/workspace/pages/workspace-layout-roadmap/workspace-layout-roadmap.component').then(
        (m) => m.WorkspaceLayoutRoadmapPageComponent,
      ),
  },
  {
    path: 'app/desktop',
    loadComponent: () =>
      import('./features/desktop/pages/desktop-roadmap/desktop-roadmap.component').then(
        (m) => m.DesktopRoadmapPageComponent,
      ),
  },
  {
    path: 'app/team',
    loadComponent: () =>
      import('./features/team/pages/team-roadmap/team-roadmap.component').then(
        (m) => m.TeamRoadmapPageComponent,
      ),
  },
  {
    path: 'app/official',
    loadComponent: () =>
      import('./features/official/pages/official-roadmap/official-roadmap.component').then(
        (m) => m.OfficialRoadmapPageComponent,
      ),
  },
  {
    path: 'app/monitoring',
    loadComponent: () =>
      import('./features/monitoring/pages/monitoring-roadmap/monitoring-roadmap.component').then(
        (m) => m.MonitoringRoadmapPageComponent,
      ),
  },
  {
    path: 'app/contracts',
    loadComponent: () =>
      import('./features/contracts/pages/contracts-roadmap/contracts-roadmap.component').then(
        (m) => m.ContractsRoadmapPageComponent,
      ),
  },
  {
    path: 'app/diff',
    loadComponent: () =>
      import('./features/diff/pages/diff-roadmap/diff-roadmap.component').then(
        (m) => m.DiffRoadmapPageComponent,
      ),
  },
  {
    path: 'app/interceptor',
    loadComponent: () =>
      import('./features/interceptor/pages/interceptor-roadmap/interceptor-roadmap.component').then(
        (m) => m.InterceptorRoadmapPageComponent,
      ),
  },
  {
    path: 'app/browser-extension',
    loadComponent: () =>
      import('./features/browser-extension/pages/browser-extension-roadmap/browser-extension-roadmap.component').then(
        (m) => m.BrowserExtensionRoadmapPageComponent,
      ),
  },
  {
    path: 'app/ai-generator',
    loadComponent: () =>
      import('./features/ai-generator/pages/ai-generator-roadmap/ai-generator-roadmap.component').then(
        (m) => m.AiGeneratorRoadmapPageComponent,
      ),
  },
  {
    path: 'app/ai-analyzer',
    loadComponent: () =>
      import('./features/ai-analyzer/pages/ai-analyzer-roadmap/ai-analyzer-roadmap.component').then(
        (m) => m.AiAnalyzerRoadmapPageComponent,
      ),
  },
  {
    path: 'app/workflows',
    loadComponent: () =>
      import('./features/workflows/pages/workflows-roadmap/workflows-roadmap.component').then(
        (m) => m.WorkflowsRoadmapPageComponent,
      ),
  },
  {
    path: 'app/marketplace',
    loadComponent: () =>
      import('./features/marketplace/pages/marketplace-roadmap/marketplace-roadmap.component').then(
        (m) => m.MarketplaceRoadmapPageComponent,
      ),
  },
  {
    path: 'app/enterprise',
    loadComponent: () =>
      import('./features/enterprise/pages/enterprise-roadmap/enterprise-roadmap.component').then(
        (m) => m.EnterpriseRoadmapPageComponent,
      ),
  },
  {
    path: 'app/profiler',
    loadComponent: () =>
      import('./features/profiler/pages/profiler-roadmap/profiler-roadmap.component').then(
        (m) => m.ProfilerRoadmapPageComponent,
      ),
  },
  {
    path: 'app/observability',
    loadComponent: () =>
      import('./features/observability/pages/observability-roadmap/observability-roadmap.component').then(
        (m) => m.ObservabilityRoadmapPageComponent,
      ),
  },
  {
    path: 'app/vault',
    loadComponent: () =>
      import('./features/vault/pages/vault-roadmap/vault-roadmap.component').then(
        (m) => m.VaultRoadmapPageComponent,
      ),
  },
  {
    path: 'app/ai-docs',
    loadComponent: () =>
      import('./features/ai-docs/pages/ai-docs-roadmap/ai-docs-roadmap.component').then(
        (m) => m.AiDocsRoadmapPageComponent,
      ),
  },
  {
    path: 'app/ai-openapi',
    loadComponent: () =>
      import('./features/ai-openapi/pages/ai-openapi-roadmap/ai-openapi-roadmap.component').then(
        (m) => m.AiOpenapiRoadmapPageComponent,
      ),
  },
  {
    path: 'app/streaming',
    loadComponent: () =>
      import('./features/streaming/pages/streaming-roadmap/streaming-roadmap.component').then(
        (m) => m.StreamingRoadmapPageComponent,
      ),
  },
  {
    path: 'app/git',
    loadComponent: () =>
      import('./features/git/pages/git-roadmap/git-roadmap.component').then(
        (m) => m.GitRoadmapPageComponent,
      ),
  },
  {
    path: 'app/sdk',
    loadComponent: () =>
      import('./features/sdk/pages/sdk-roadmap/sdk-roadmap.component').then(
        (m) => m.SdkRoadmapPageComponent,
      ),
  },
];
