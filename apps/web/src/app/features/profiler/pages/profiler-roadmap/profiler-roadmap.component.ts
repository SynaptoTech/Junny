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

export interface ProfilerRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  strategicGoals: readonly string[];
  timingsFuture: readonly string[];
  waterfallPhases: readonly string[];
  plannedUiComponents: readonly string[];
  performanceGoals: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    timings: string;
    metrics: string;
    analyzers: string;
  };
}

const PROFILER_ROADMAP_FALLBACK: ProfilerRoadmapApi = {
  phase: 'roadmap',
  md: 'MD41_JUNNY_API_PERFORMANCE_PROFILER.md',
  description:
    'Roadmap para waterfall DNS→response, métricas de latência e painéis em dark-first — com foco em baixo overhead e integrações futuras (monitoring, contratos, interceptor).',
  principles: ['baixo-overhead', 'captura-opt-in-transparente', 'sem-cloud-forçada-no-mvp-profiling'],
  strategicGoals: [
    'ferramenta moderna de análise de performance APIs no Junny',
    'visualização clara vs ferramentas básicas apenas com status code',
    'preparar integração com ecossistema existente de debugging',
  ],
  timingsFuture: [
    'DNS lookup',
    'TCP connect',
    'TLS handshake',
    'request send',
    'server processing',
    'response receive',
  ],
  waterfallPhases: ['DNS', 'TCP', 'TLS', 'REQUEST', 'RESPONSE'],
  plannedUiComponents: [
    'PerformanceTimeline',
    'WaterfallChart',
    'LatencyBreakdown',
    'MetricsPanel',
  ],
  performanceGoals: ['baixo overhead', 'captura eficiente', 'análise rápida'],
  mvpGoals: [
    'latency breakdown',
    'waterfall',
    'timing metrics',
    'performance visualization',
  ],
  deferred: ['distributed tracing', 'APM completo', 'AI performance analysis', 'profiling obrigatório na cloud'],
  frontendStructure: '/features/profiler',
  backendLayout: {
    moduleRoot: '/modules/profiler',
    timings: '/modules/profiler/timings',
    metrics: '/modules/profiler/metrics',
    analyzers: '/modules/profiler/analyzers',
  },
};

@Component({
  selector: 'app-profiler-roadmap-page',
  standalone: true,
  templateUrl: './profiler-roadmap.component.html',
})
export class ProfilerRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD41_JUNNY_API_PERFORMANCE_PROFILER.md';

  private readonly apiRoadmap = signal<ProfilerRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): ProfilerRoadmapApi => this.apiRoadmap() ?? PROFILER_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<ProfilerRoadmapApi>(
        `${environment.apiOrigin}/api/profiler/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD41.',
          ),
      });
  }
}
