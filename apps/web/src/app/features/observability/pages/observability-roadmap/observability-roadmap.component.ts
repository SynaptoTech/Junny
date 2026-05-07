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

export interface ObservabilityRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  strategicGoals: readonly string[];
  metricsFuture: readonly string[];
  visualStackPlanned: readonly string[];
  plannedUiComponents: readonly string[];
  performanceGoals: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    metrics: string;
    streams: string;
    collectors: string;
  };
}

const OBSERVABILITY_ROADMAP_FALLBACK: ObservabilityRoadmapApi = {
  phase: 'roadmap',
  md: 'MD42_JUNNY_REALTIME_OBSERVABILITY_DASHBOARD.md',
  description:
    'Roadmap para dashboard dark-first de métricas e streams (uptime, latency, eventos) com integração futura a monitoring, interceptor e profiler — baixo overhead, sem APM completo no arranque.',
  principles: [
    'dark-first-consistente-com-junny',
    'baixo-overhead-streams',
    'telemetry-nao-invasiva-no-mvp',
  ],
  strategicGoals: [
    'observabilidade moderna integrada ao ecossistema Junny',
    'visibilidade operacional para equipas backend, DevOps e QA',
    'preparar painéis enterprise sem cloud obrigatória',
  ],
  metricsFuture: [
    'uptime',
    'latency',
    'requests/sec',
    'failures',
    'status codes',
    'throughput',
  ],
  visualStackPlanned: ['Realtime Metrics', 'Latency Charts', 'Status Panels', 'Event Streams'],
  plannedUiComponents: [
    'MetricsDashboard',
    'RealtimeChart',
    'StatusPanel',
    'EventStreamViewer',
    'TrafficOverview',
  ],
  performanceGoals: ['baixo overhead', 'stream eficiente', 'render otimizado'],
  mvpGoals: [
    'realtime metrics',
    'uptime panels',
    'latency charts',
    'event streams',
  ],
  deferred: ['full APM', 'distributed tracing', 'cloud observability mandatory', 'telemetry invasiva'],
  frontendStructure: '/features/observability',
  backendLayout: {
    moduleRoot: '/modules/observability',
    metrics: '/modules/observability/metrics',
    streams: '/modules/observability/streams',
    collectors: '/modules/observability/collectors',
  },
};

@Component({
  selector: 'app-observability-roadmap-page',
  standalone: true,
  templateUrl: './observability-roadmap.component.html',
})
export class ObservabilityRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD42_JUNNY_REALTIME_OBSERVABILITY_DASHBOARD.md';

  private readonly apiRoadmap = signal<ObservabilityRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): ObservabilityRoadmapApi =>
      this.apiRoadmap() ?? OBSERVABILITY_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<ObservabilityRoadmapApi>(
        `${environment.apiOrigin}/api/observability/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD42.',
          ),
      });
  }
}
