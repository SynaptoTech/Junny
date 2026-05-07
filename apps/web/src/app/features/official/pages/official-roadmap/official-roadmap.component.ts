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

export interface OfficialRoadmapPhase {
  readonly id: number;
  readonly name: string;
  readonly objectivePt: string;
  readonly status?: string;
  readonly features: readonly string[];
  readonly strategicGoalPt: string;
}

export interface OfficialRoadmapApi {
  phase: string;
  md: string;
  title: string;
  vision: string;
  positioning: string;
  notPositioningAs: string;
  philosophy: readonly string[];
  mainGoals: readonly { id: string; labelPt: string; summaryPt: string }[];
  phases: readonly OfficialRoadmapPhase[];
  strategies: {
    openSource: string;
    cloud: string;
    ai: string;
    userControl: string;
  };
  differentiators: readonly string[];
  inspirations: readonly string[];
  exclusions: readonly string[];
  longTermVision: string;
}

/** Payload espelho do stub Nest `/api/official/roadmap` (SSR / offline). */
const OFFICIAL_ROADMAP_FALLBACK: OfficialRoadmapApi = {
  phase: 'v1',
  md: 'MD30_JUNNY_OFFICIAL_ROADMAP_V1.md',
  title: 'Junny Official Roadmap v1',
  vision: 'Open Integration Studio',
  positioning: 'plataforma moderna extensível de integração',
  notPositioningAs: 'clone Postman',
  philosophy: [
    'open source',
    'local-first',
    'privacy-first',
    'developer-first',
    'web-first',
    'extensível',
  ],
  mainGoals: [
    { id: 'simplicity', labelPt: 'Simplicidade', summaryPt: 'Reduzir complexidade.' },
    { id: 'performance', labelPt: 'Performance', summaryPt: 'Experiência extremamente rápida.' },
    { id: 'modernity', labelPt: 'Modernidade', summaryPt: 'UX moderna premium.' },
    { id: 'extensibility', labelPt: 'Extensibilidade', summaryPt: 'Arquitetura preparada para crescimento.' },
  ],
  phases: [
    {
      id: 1,
      name: 'Foundation',
      status: 'in-progress',
      objectivePt: 'MVP moderno estável.',
      features: [
        'REST Workspace',
        'Collections',
        'Environments',
        'History',
        'Authentication',
        'OpenAPI Import',
        'branding / landing',
        'arquitetura base',
      ],
      strategicGoalPt: 'MVP sólido moderno',
    },
    {
      id: 2,
      name: 'Multi Protocol',
      objectivePt: 'Expandir protocolos.',
      features: ['GraphQL', 'SOAP', 'WebSocket', 'gRPC', 'Kafka roadmap'],
      strategicGoalPt: 'hub integração moderno',
    },
    {
      id: 3,
      name: 'Productivity',
      objectivePt: 'Produtividade do developer.',
      features: [
        'cURL Import',
        'Code Generator',
        'Request Runner',
        'Workspace Layout',
        'Advanced History',
      ],
      strategicGoalPt: 'workflow integração profissional',
    },
    {
      id: 4,
      name: 'Mock + Automation',
      objectivePt: 'Automação e QA.',
      features: ['Mock Server', 'Request Chaining', 'Variables Runtime', 'Workflows básicos'],
      strategicGoalPt: 'além do consumo de APIs',
    },
    {
      id: 5,
      name: 'Plugins + Extensibility',
      objectivePt: 'Ecossistema extensível.',
      features: ['Plugin SDK', 'Protocol Plugins', 'UI Extensions', 'Community Plugins'],
      strategicGoalPt: 'ecossistema open source',
    },
    {
      id: 6,
      name: 'AI Integration',
      objectivePt: 'Produtividade inteligente.',
      features: [
        'AI Assistant',
        'Generate Requests',
        'Explain Errors',
        'Generate Queries',
        'Convert cURL',
      ],
      strategicGoalPt: 'integração inteligente',
    },
    {
      id: 7,
      name: 'Desktop',
      objectivePt: 'Experiência nativa premium.',
      features: ['Tauri', 'Secure Storage', 'Native Runtime', 'Offline Advanced'],
      strategicGoalPt: 'ferramenta desktop profissional',
    },
    {
      id: 8,
      name: 'Enterprise',
      objectivePt: 'Expansão enterprise.',
      features: [
        'Team Workspaces',
        'RBAC',
        'Shared Collections',
        'API Governance',
        'Monitoring futuro',
      ],
      strategicGoalPt: 'enterprise integration',
    },
  ],
  strategies: {
    openSource: 'núcleo open source',
    cloud: 'opcional',
    ai: 'opcional',
    userControl: 'controle total',
  },
  differentiators: [
    'UX moderna',
    'multi protocolos',
    'local-first',
    'IA opcional',
    'open source',
    'plugins',
    'performance',
  ],
  inspirations: ['Linear', 'Raycast', 'Vercel', 'Bruno', 'Hoppscotch'],
  exclusions: ['ferramenta pesada', 'UX antiga', 'cloud obrigatória', 'lock-in', 'telemetria invasiva'],
  longTermVision:
    'referência moderna open source para integração de APIs — developer platform internacional.',
};

@Component({
  selector: 'app-official-roadmap-page',
  standalone: true,
  templateUrl: './official-roadmap.component.html',
})
export class OfficialRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD30_JUNNY_OFFICIAL_ROADMAP_V1.md';

  private readonly apiRoadmap = signal<OfficialRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  /** Conteúdo para render: API live ou cópia local do stub (MD30). */
  readonly roadmapView = computed(
    (): OfficialRoadmapApi => this.apiRoadmap() ?? OFFICIAL_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<OfficialRoadmapApi>(
        `${environment.apiOrigin}/api/official/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se alinhado ao MD30.',
          ),
      });
  }
}
