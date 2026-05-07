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

export interface MonitoringRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoal: string;
  notOnly: string;
  useCases: readonly string[];
  monitorTypes: readonly string[];
  healthCheckExample: string;
  statusVisual: readonly { id: string; label: string; colorPt: string }[];
  dashboardColumns: readonly string[];
  componentsPlanned: readonly string[];
  backendLayout: {
    moduleRoot: string;
    services: string;
    checks: string;
    alerts: string;
  };
  checkFrequencyPresets: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  prismaEntitiesFuture: readonly string[];
  frontendStructure: string;
}

const MONITORING_ROADMAP_FALLBACK: MonitoringRoadmapApi = {
  phase: 'roadmap',
  md: 'MD31_JUNNY_API_MONITORING_SYSTEM.md',
  description:
    'Visão de monitoring local-first: health/uptime, latência, dashboard escuro-first e histórico mínimo — sem monitoring distribuído nem cloud obrigatória na v0.',
  strategicGoal: 'plataforma completa de operação APIs',
  notOnly: 'ferramenta desenvolvimento',
  useCases: ['APIs críticas', 'fintech', 'backend teams', 'QA', 'observabilidade'],
  monitorTypes: ['REST', 'GraphQL', 'SOAP', 'WebSocket futuro'],
  healthCheckExample: 'GET /health',
  statusVisual: [
    { id: 'healthy', label: 'Healthy', colorPt: 'Verde' },
    { id: 'warning', label: 'Warning', colorPt: 'Amarelo' },
    { id: 'down', label: 'Down', colorPt: 'Vermelho' },
  ],
  dashboardColumns: ['API Name', 'Status', 'Latency', 'Last Check'],
  componentsPlanned: [
    'MonitoringDashboard',
    'HealthCard',
    'UptimeChart',
    'AlertPanel',
    'MonitoringTimeline',
  ],
  backendLayout: {
    moduleRoot: '/modules/monitoring',
    services: '/modules/monitoring/services',
    checks: '/modules/monitoring/checks',
    alerts: '/modules/monitoring/alerts',
  },
  checkFrequencyPresets: ['1m', '5m', '15m', '1h'],
  mvpGoals: [
    'health checks',
    'uptime status',
    'monitoring dashboard',
    'latency tracking',
  ],
  deferred: [
    'distributed monitoring',
    'AI anomaly detection',
    'realtime alert engine',
    'cloud mandatory monitoring',
  ],
  prismaEntitiesFuture: ['MonitoringChecks', 'MonitoringExecutions'],
  frontendStructure: '/features/monitoring',
};

@Component({
  selector: 'app-monitoring-roadmap-page',
  standalone: true,
  templateUrl: './monitoring-roadmap.component.html',
})
export class MonitoringRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD31_JUNNY_API_MONITORING_SYSTEM.md';

  private readonly apiRoadmap = signal<MonitoringRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): MonitoringRoadmapApi => this.apiRoadmap() ?? MONITORING_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<MonitoringRoadmapApi>(
        `${environment.apiOrigin}/api/monitoring/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD31.',
          ),
      });
  }
}
