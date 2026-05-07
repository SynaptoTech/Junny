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

export interface AiGeneratorRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  strategicGoals: readonly string[];
  restExamplePrompt: string;
  graphQlExamplePrompt: string;
  soapExamplePrompt: string;
  generatorOutputs: readonly string[];
  providersFuture: readonly string[];
  backendLayout: {
    moduleRoot: string;
    providers: string;
    prompts: string;
    services: string;
  };
  mvpGoals: readonly string[];
  deferred: readonly string[];
  safetyRules: readonly string[];
  frontendStructure: string;
}

const AI_GENERATOR_ROADMAP_FALLBACK: AiGeneratorRoadmapApi = {
  phase: 'roadmap',
  md: 'MD36_JUNNY_AI_REQUEST_GENERATOR.md',
  description:
    'Roadmap para assistente que transforma texto natural em pedidos REST, queries/mutations GraphQL e envelopes SOAP, com previews editáveis, integração a collections/environments/OpenAPI quando existir contexto — IA sempre opcional e com modo local-first (Ollama/llama/GGUF planejados).',
  principles: ['ia-opcional', 'nucleo-funciona-sem-provedores', 'privacy-first'],
  strategicGoals: [
    'plataforma inteligente de integração',
    'permite IA privada/local quando o utilizador quiser',
    'aumentar produtividade real — não apenas marketing surface',
  ],
  restExamplePrompt: 'Create a REST request for GitHub users API',
  graphQlExamplePrompt: 'Generate GraphQL login mutation',
  soapExamplePrompt: 'Generate SOAP envelope for payment request',
  generatorOutputs: [
    'method',
    'URL',
    'headers',
    'query params',
    'body',
    'auth scaffolding (sem valores sensíveis automáticos)',
  ],
  providersFuture: [
    'OpenAI',
    'OpenRouter',
    'Ollama',
    'Anthropic',
    'modelos GGUF/locais',
  ],
  backendLayout: {
    moduleRoot: '/modules/ai-generator',
    providers: '/modules/ai-generator/providers',
    prompts: '/modules/ai-generator/prompts',
    services: '/modules/ai-generator/services',
  },
  mvpGoals: [
    'generate REST',
    'generate GraphQL',
    'generate SOAP',
    'AI prompt input',
  ],
  deferred: [
    'autonomous agents',
    'cloud mandatory AI',
    'telemetry prompts',
    'auto execution requests',
  ],
  safetyRules: [
    'nunca enviar tokens, secrets ou passwords automaticamente aos providers',
  ],
  frontendStructure: '/features/ai-generator',
};

@Component({
  selector: 'app-ai-generator-roadmap-page',
  standalone: true,
  templateUrl: './ai-generator-roadmap.component.html',
})
export class AiGeneratorRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD36_JUNNY_AI_REQUEST_GENERATOR.md';

  private readonly apiRoadmap = signal<AiGeneratorRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): AiGeneratorRoadmapApi =>
      this.apiRoadmap() ?? AI_GENERATOR_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<AiGeneratorRoadmapApi>(
        `${environment.apiOrigin}/api/ai-generator/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD36.',
          ),
      });
  }
}
