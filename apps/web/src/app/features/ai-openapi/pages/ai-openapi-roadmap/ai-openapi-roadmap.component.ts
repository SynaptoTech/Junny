import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface AiOpenapiRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  primaryFlowSteps: readonly string[];
  openapiExampleSnippet: string;
  restExamplePath: string;
  plannedUiComponents: readonly string[];
  mvpGoals: readonly string[];
  collectionIntegration: readonly string[];
  exportsFuture: readonly string[];
  validationIntegrationsFuture: readonly string[];
  deferred: readonly string[];
  safetyRules: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    providers: string;
    generators: string;
    schemas: string;
  };
}

const AI_OPENAPI_ROADMAP_FALLBACK: AiOpenapiRoadmapApi = {
  phase: 'roadmap',
  md: 'MD45_JUNNY_AI_OPENAPI_GENERATOR.md',
  description:
    'Roadmap para inferir OpenAPI e schemas a partir de requests/responses e coleções, com preview YAML/JSON, export e IA opcional — privacy-first, sem envio automático de credenciais.',
  principles: ['ia-opcional', 'privacy-first', 'schema-first'],
  primaryFlowSteps: [
    'executar requests ou usar histórico/coleções',
    'opcionalmente enviar traces para IA (opt-in)',
    'gerar/atualizar spec OpenAPI e schemas revisáveis',
  ],
  openapiExampleSnippet: 'openapi: 3.0.0\npaths:\n  /users:',
  restExamplePath: 'GET /users',
  plannedUiComponents: [
    'GenerateOpenAPIButton',
    'OpenAPIPreview',
    'SchemaViewer',
    'ContractBuilder',
  ],
  mvpGoals: [
    'infer OpenAPI',
    'generate schemas',
    'YAML export',
    'requests analysis',
  ],
  collectionIntegration: ['Collection', '↓', 'Generate OpenAPI'],
  exportsFuture: ['YAML export', 'JSON export', 'schema download'],
  validationIntegrationsFuture: [
    'Contract Testing',
    'API Diff',
    'Validation Engine',
  ],
  deferred: [
    'autonomous API modeling',
    'cloud mandatory AI',
    'telemetry on payloads',
    'auto publishing schemas',
  ],
  safetyRules: [
    'nunca enviar automaticamente secrets, passwords ou tokens aos providers',
  ],
  frontendStructure: '/features/ai-openapi',
  backendLayout: {
    moduleRoot: '/modules/ai-openapi',
    providers: '/modules/ai-openapi/providers',
    generators: '/modules/ai-openapi/generators',
    schemas: '/modules/ai-openapi/schemas',
  },
};

@Component({
  selector: 'app-ai-openapi-roadmap-page',
  standalone: true,
  templateUrl: './ai-openapi-roadmap.component.html',
})
export class AiOpenapiRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD45_JUNNY_AI_OPENAPI_GENERATOR.md';

  private readonly apiRoadmap = signal<AiOpenapiRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): AiOpenapiRoadmapApi => this.apiRoadmap() ?? AI_OPENAPI_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<AiOpenapiRoadmapApi>(`${environment.apiOrigin}/api/ai-openapi/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD45.',
          ),
      });
  }
}
