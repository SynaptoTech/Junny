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

export interface AiAnalyzerRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  strategicGoals: readonly string[];
  primaryFlowSteps: readonly string[];
  plannedUiComponents: readonly string[];
  errorCategories: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  safetyRules: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    providers: string;
    prompts: string;
    services: string;
  };
  providersFuture: readonly string[];
}

const AI_ANALYZER_ROADMAP_FALLBACK: AiAnalyzerRoadmapApi = {
  phase: 'roadmap',
  md: 'MD37_JUNNY_AI_RESPONSE_ANALYZER.md',
  description:
    'Roadmap para assistente opcional que explica erros de API (REST, GraphQL, SOAP), sugere fixes (headers, auth, payload), categoriza falhas e integra fluxo Analyze with AI às coleções — com privacy-first (controlo de envio de payloads, modo local/offline quando existir infraestrutura).',
  principles: ['ia-opcional', 'nucleo-funciona-sem-provedores', 'privacy-first'],
  strategicGoals: [
    'assistente inteligente de debugging de APIs dentro do Junny',
    'reduzir tempo de troubleshooting e onboarding em APIs complexas',
    'aumentar produtividade real sem impor IA na cloud',
  ],
  primaryFlowSteps: [
    'utilizador executa um pedido',
    'Junny deteta erro (ex.: 401 Unauthorized)',
    'utilizador clica “Analyze with AI”',
    'IA sugere causa provável, headers em falta, auth/payload/schema e próximos passos',
  ],
  plannedUiComponents: [
    'AnalyzeButton',
    'AIAnalysisPanel',
    'SuggestedFixes',
    'ErrorInsights',
  ],
  errorCategories: ['auth', 'network', 'timeout', 'validation', 'schema mismatch'],
  mvpGoals: ['explain errors', 'analyze responses', 'suggest fixes', 'GraphQL analysis'],
  deferred: [
    'correções autónomas não solicitadas',
    'execução automática de requests',
    'telemetria de payloads',
    'IA obrigatória na cloud',
  ],
  safetyRules: [
    'nunca enviar tokens, secrets ou passwords automaticamente aos providers',
  ],
  frontendStructure: '/features/ai-analyzer',
  backendLayout: {
    moduleRoot: '/modules/ai-analyzer',
    providers: '/modules/ai-analyzer/providers',
    prompts: '/modules/ai-analyzer/prompts',
    services: '/modules/ai-analyzer/services',
  },
  providersFuture: ['OpenAI', 'OpenRouter', 'Ollama', 'Anthropic', 'modelos locais'],
};

@Component({
  selector: 'app-ai-analyzer-roadmap-page',
  standalone: true,
  templateUrl: './ai-analyzer-roadmap.component.html',
})
export class AiAnalyzerRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD37_JUNNY_AI_RESPONSE_ANALYZER.md';

  private readonly apiRoadmap = signal<AiAnalyzerRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): AiAnalyzerRoadmapApi => this.apiRoadmap() ?? AI_ANALYZER_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<AiAnalyzerRoadmapApi>(
        `${environment.apiOrigin}/api/ai-analyzer/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD37.',
          ),
      });
  }
}
