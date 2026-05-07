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

export interface WorkflowsRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  primaryFlowSteps: readonly string[];
  protocolsSupported: readonly string[];
  plannedUiComponents: readonly string[];
  aiWorkflowExamplePrompt: string;
  mvpGoals: readonly string[];
  deferred: readonly string[];
  securityRules: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    engine: string;
    executors: string;
    runtime: string;
  };
}

const WORKFLOWS_ROADMAP_FALLBACK: WorkflowsRoadmapApi = {
  phase: 'roadmap',
  md: 'MD38_JUNNY_AI_WORKFLOW_BUILDER.md',
  description:
    'Roadmap para canvas visual de workflows de API (REST, GraphQL, SOAP; WebSocket/Kafka/gRPC mais tarde), com chaining, condições, variáveis de runtime, prompts de IA opcionais para sugerir/gerar fluxos — foco em execução local e integrações com collections e runners.',
  principles: [
    'ia-opcional',
    'automação-integrada-ao-ecossistema-api-do-junny',
    'local-first-execution-inicialmente',
  ],
  primaryFlowSteps: [
    'criar workflow',
    'adição de pedidos nos nós',
    'adição de condições/bifurcações',
    'execução do fluxo como um todo',
  ],
  protocolsSupported: ['REST', 'GraphQL', 'SOAP'],
  plannedUiComponents: [
    'WorkflowCanvas',
    'WorkflowNode',
    'ConnectionLines',
    'WorkflowRunner',
    'ConditionEditor',
  ],
  aiWorkflowExamplePrompt: 'Create login workflow with token validation',
  mvpGoals: [
    'visual workflows',
    'request chaining',
    'basic conditions',
    'runtime variables',
  ],
  deferred: [
    'workflows distribuídos',
    'execução cloud obrigatória',
    'agentes autónomos de IA',
    'orquestração enterprise genérica tipo n8n',
  ],
  securityRules: ['workflows locais no arranque', 'execução na cloud opcional/desativada inicialmente'],
  frontendStructure: '/features/workflows',
  backendLayout: {
    moduleRoot: '/modules/workflows',
    engine: '/modules/workflows/engine',
    executors: '/modules/workflows/executors',
    runtime: '/modules/workflows/runtime',
  },
};

@Component({
  selector: 'app-workflows-roadmap-page',
  standalone: true,
  templateUrl: './workflows-roadmap.component.html',
})
export class WorkflowsRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD38_JUNNY_AI_WORKFLOW_BUILDER.md';

  private readonly apiRoadmap = signal<WorkflowsRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): WorkflowsRoadmapApi => this.apiRoadmap() ?? WORKFLOWS_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<WorkflowsRoadmapApi>(
        `${environment.apiOrigin}/api/workflows/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD38.',
          ),
      });
  }
}
