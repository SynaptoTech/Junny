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

export interface ContractsRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoals: readonly string[];
  contractTypes: readonly string[];
  mainFlowSteps: readonly string[];
  openapiValidationAreas: readonly string[];
  graphqlValidationAreas: readonly string[];
  breakingChangeSignals: readonly string[];
  backendLayout: {
    moduleRoot: string;
    validators: string;
    schemas: string;
    comparators: string;
  };
  componentsPlanned: readonly string[];
  validationResultKinds: readonly string[];
  statusVisual: readonly { id: string; label: string; colorPt: string }[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  frontendStructure: string;
}

const CONTRACTS_ROADMAP_FALLBACK: ContractsRoadmapApi = {
  phase: 'roadmap',
  md: 'MD32_JUNNY_CONTRACT_TESTING_SCHEMA_VALIDATION.md',
  description:
    'Roadmap para validação de contratos contra OpenAPI / GraphQL, detecção de breaking changes e integração futura com collections, runner e CI — execução local-first, sem policy engine obrigatório na v0.',
  strategicGoals: [
    'plataforma moderna de governança APIs',
    'governança APIs moderna',
  ],
  contractTypes: [
    'REST OpenAPI',
    'GraphQL Schema',
    'SOAP XML Schema futuro',
  ],
  mainFlowSteps: [
    'importar schema',
    'executar request',
    'validar response',
    'detectar inconsistências',
  ],
  openapiValidationAreas: [
    'status codes',
    'response body',
    'request body',
    'required fields',
  ],
  graphqlValidationAreas: [
    'query structure',
    'response schema',
    'required fields',
  ],
  breakingChangeSignals: [
    'removed fields',
    'changed types',
    'renamed endpoints',
  ],
  backendLayout: {
    moduleRoot: '/modules/contracts',
    validators: '/modules/contracts/validators',
    schemas: '/modules/contracts/schemas',
    comparators: '/modules/contracts/comparators',
  },
  componentsPlanned: [
    'ContractValidator',
    'SchemaViewer',
    'ValidationResults',
    'BreakingChangesPanel',
  ],
  validationResultKinds: ['passed', 'warnings', 'failed', 'missing fields'],
  statusVisual: [
    { id: 'valid', label: 'Valid', colorPt: 'Verde' },
    { id: 'warning', label: 'Warning', colorPt: 'Amarelo' },
    { id: 'invalid', label: 'Invalid', colorPt: 'Vermelho' },
  ],
  mvpGoals: [
    'OpenAPI validation',
    'GraphQL validation',
    'response validation',
    'basic schema diff',
  ],
  deferred: [
    'distributed validation',
    'AI schema analysis',
    'policy engine',
    'realtime governance',
  ],
  frontendStructure: '/features/contracts',
};

@Component({
  selector: 'app-contracts-roadmap-page',
  standalone: true,
  templateUrl: './contracts-roadmap.component.html',
})
export class ContractsRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD32_JUNNY_CONTRACT_TESTING_SCHEMA_VALIDATION.md';

  private readonly apiRoadmap = signal<ContractsRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): ContractsRoadmapApi => this.apiRoadmap() ?? CONTRACTS_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<ContractsRoadmapApi>(`${environment.apiOrigin}/api/contracts/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD32.',
          ),
      });
  }
}
