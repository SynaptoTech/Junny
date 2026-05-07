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

export interface DiffRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoals: readonly string[];
  diffTypes: readonly string[];
  mainFlowSteps: readonly string[];
  visualDiffKinds: readonly string[];
  statusVisual: readonly { id: string; label: string; colorPt: string }[];
  openapiCompareAreas: readonly string[];
  graphqlCompareAreas: readonly string[];
  responseCompareAreas: readonly string[];
  breakingChangeSignals: readonly string[];
  backendLayout: {
    moduleRoot: string;
    comparators: string;
    schemas: string;
    reports: string;
  };
  componentsPlanned: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  frontendStructure: string;
}

const DIFF_ROADMAP_FALLBACK: DiffRoadmapApi = {
  phase: 'roadmap',
  md: 'MD33_JUNNY_API_DIFF_SYSTEM.md',
  description:
    'Roadmap para diff visual de schemas/responses OpenAPI e GraphQL, detecção de breaking changes e relatórios exportáveis — local-first e integrável depois ao runner/contracts; sem realtime governance nem motor de approvals na v0.',
  strategicGoals: [
    'ferramenta moderna de evolução APIs',
    'evolução APIs com segurança',
    'reduzir falhas produção',
  ],
  diffTypes: ['OpenAPI', 'GraphQL', 'Responses'],
  mainFlowSteps: [
    'selecionar schema A',
    'selecionar schema B',
    'executar compare',
    'visualizar diferenças',
  ],
  visualDiffKinds: ['added', 'removed', 'modified'],
  statusVisual: [
    { id: 'added', label: 'Added', colorPt: 'Verde' },
    { id: 'modified', label: 'Modified', colorPt: 'Amarelo' },
    { id: 'removed', label: 'Removed', colorPt: 'Vermelho' },
  ],
  openapiCompareAreas: [
    'endpoints',
    'request bodies',
    'response bodies',
    'status codes',
    'paths',
    'methods',
    'request schema',
    'response schema',
  ],
  graphqlCompareAreas: ['types', 'fields', 'queries', 'mutations', 'enums'],
  responseCompareAreas: ['payloads', 'status', 'headers'],
  breakingChangeSignals: [
    'endpoint removido',
    'campo removido',
    'tipo alterado',
    'response incompatível',
  ],
  backendLayout: {
    moduleRoot: '/modules/diff',
    comparators: '/modules/diff/comparators',
    schemas: '/modules/diff/schemas',
    reports: '/modules/diff/reports',
  },
  componentsPlanned: [
    'DiffViewer',
    'SchemaComparator',
    'BreakingChangesPanel',
    'ResponseCompare',
  ],
  mvpGoals: [
    'OpenAPI compare',
    'GraphQL compare',
    'response diff',
    'breaking changes detection',
  ],
  deferred: [
    'realtime governance',
    'AI diff explanation',
    'distributed compare',
    'approval engine',
  ],
  frontendStructure: '/features/diff',
};

@Component({
  selector: 'app-diff-roadmap-page',
  standalone: true,
  templateUrl: './diff-roadmap.component.html',
})
export class DiffRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD33_JUNNY_API_DIFF_SYSTEM.md';

  private readonly apiRoadmap = signal<DiffRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): DiffRoadmapApi => this.apiRoadmap() ?? DIFF_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<DiffRoadmapApi>(`${environment.apiOrigin}/api/diff/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD33.',
          ),
      });
  }
}
