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

export interface AiDocsRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  primaryFlowSteps: readonly string[];
  generatedDocSections: readonly string[];
  restExamplePath: string;
  providersFuture: readonly string[];
  plannedUiComponents: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  safetyRules: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    providers: string;
    prompts: string;
    generators: string;
  };
}

const AI_DOCS_ROADMAP_FALLBACK: AiDocsRoadmapApi = {
  phase: 'roadmap',
  md: 'MD44_JUNNY_AI_API_DOCUMENTATION_GENERATOR.md',
  description:
    'Roadmap para Generate Docs a partir de requests/coleções/OpenAPI com preview markdown, export e IA opcional — privacy-first, sem envio automático de credenciais.',
  principles: ['ia-opcional', 'privacy-first', 'nucleo-util-sem-ia'],
  primaryFlowSteps: [
    'selecionar request ou collection',
    'clicar Generate Docs',
    'IA (ou motor local futuro) gera documentação editável',
  ],
  generatedDocSections: [
    'endpoint description',
    'auth explanation',
    'examples',
    'payload explanation',
    'response explanation',
  ],
  restExamplePath: 'GET /users',
  providersFuture: ['OpenAI', 'OpenRouter', 'Ollama', 'Anthropic', 'modelos locais'],
  plannedUiComponents: [
    'GenerateDocsButton',
    'DocsPreview',
    'MarkdownViewer',
    'ExampleGenerator',
  ],
  mvpGoals: [
    'generate endpoint docs',
    'generate examples',
    'markdown generation',
    'collection documentation',
  ],
  deferred: [
    'publicação autónoma de docs',
    'IA cloud obrigatória',
    'telemetria sobre conteúdo gerado',
    'auto publish sem revisão',
  ],
  safetyRules: [
    'nunca enviar automaticamente secrets, passwords ou tokens aos providers',
  ],
  frontendStructure: '/features/ai-docs',
  backendLayout: {
    moduleRoot: '/modules/ai-docs',
    providers: '/modules/ai-docs/providers',
    prompts: '/modules/ai-docs/prompts',
    generators: '/modules/ai-docs/generators',
  },
};

@Component({
  selector: 'app-ai-docs-roadmap-page',
  standalone: true,
  templateUrl: './ai-docs-roadmap.component.html',
})
export class AiDocsRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD44_JUNNY_AI_API_DOCUMENTATION_GENERATOR.md';

  private readonly apiRoadmap = signal<AiDocsRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): AiDocsRoadmapApi => this.apiRoadmap() ?? AI_DOCS_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<AiDocsRoadmapApi>(`${environment.apiOrigin}/api/ai-docs/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD44.',
          ),
      });
  }
}
