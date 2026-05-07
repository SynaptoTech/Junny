import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Realtime Observability Dashboard — roadmap (MD42); sem APM/trace completo no MVP.
 */
@ApiTags('observability')
@Controller('api/observability')
export class ObservabilityRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Dashboard realtime de observabilidade de APIs — stub MD42 (streams & widgets futuros)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    strategicGoals: readonly string[];
    useCases: readonly string[];
    metricsFuture: readonly string[];
    streamSourcesFuture: readonly string[];
    dashboardWidgetsFuture: readonly string[];
    statusVisual: readonly { status: string; colorHint: string }[];
    chartTypesFuture: readonly string[];
    visualStackPlanned: readonly string[];
    realtimeEngineFuture: readonly string[];
    integrationFuture: readonly string[];
    logsViewFuture: readonly string[];
    objectives: readonly string[];
    environmentsFuture: readonly string[];
    enterpriseThemesFuture: readonly string[];
    performanceGoals: readonly string[];
    uxRequirements: readonly string[];
    plannedUiComponents: readonly string[];
    backendLayout: {
      moduleRoot: string;
      metrics: string;
      streams: string;
      collectors: string;
    };
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
  } {
    return {
      phase: 'roadmap',
      md: 'MD42_JUNNY_REALTIME_OBSERVABILITY_DASHBOARD.md',
      description:
        'Roadmap para painel dark-first de métricas quase live (uptime, latency, rps, falhas, throughput) com widgets, gráficos em linha e vistas de streams (WebSocket/Kafka/subscriptions GraphQL no horizonte longo) — integrável com monitoring, traffic interceptor e profiler, com baixo overhead e sem impor APM ou tracing distribuído desde o início.',
      principles: [
        'dark-first-consistente-com-junny',
        'baixo-overhead-streams',
        'telemetry-nao-invasiva-no-mvp',
      ],
      strategicGoals: [
        'plataforma moderna de observabilidade sobre o tráfego já visível no Junny',
        'reduzir troubleshooting e ganhar visibilidade operacional em APIs críticas',
        'preparar runway enterprise (SLA, incidentes, governança) sem obrigar cloud SaaS',
      ],
      useCases: [
        'backend teams monitorando regressões realtime',
        'DevOps/SRE combinando workspaces com painéis de saúde',
        'QA acompanhando execuções e APIs internas',
        'fintech e operações centrados em SLA',
      ],
      metricsFuture: [
        'uptime',
        'latency',
        'requests/sec',
        'failures',
        'status codes',
        'throughput',
      ],
      streamSourcesFuture: ['WebSocket events', 'Kafka streams', 'GraphQL subscriptions'],
      dashboardWidgetsFuture: [
        'uptime cards',
        'latency charts',
        'traffic charts',
        'error panels',
        'event streams',
      ],
      statusVisual: [
        { status: 'Healthy', colorHint: 'verde' },
        { status: 'Warning', colorHint: 'amarelo' },
        { status: 'Critical', colorHint: 'vermelho' },
      ],
      chartTypesFuture: [
        'line charts',
        'realtime charts',
        'latency graphs',
        'throughput graphs',
      ],
      visualStackPlanned: ['Realtime Metrics', 'Latency Charts', 'Status Panels', 'Event Streams'],
      realtimeEngineFuture: ['websocket updates', 'live metrics', 'streaming dashboards'],
      integrationFuture: ['Monitoring System', 'Traffic Interceptor', 'Performance Profiler'],
      logsViewFuture: ['API logs', 'request logs', 'errors', 'incidents'],
      objectives: [
        'reduzir troubleshooting médio',
        'aumentar visibilidade ponta-a-ponta',
        'melhorar operação contínua de APIs',
      ],
      environmentsFuture: ['Development', 'Staging', 'Production'],
      enterpriseThemesFuture: [
        'team dashboards',
        'governance panels',
        'SLA dashboards',
        'incident tracking',
      ],
      performanceGoals: ['baixo overhead', 'stream eficiente', 'render otimizado'],
      uxRequirements: ['extremamente visual', 'moderna', 'clara', 'fluida', 'dark-first'],
      plannedUiComponents: [
        'MetricsDashboard',
        'RealtimeChart',
        'StatusPanel',
        'EventStreamViewer',
        'TrafficOverview',
      ],
      frontendStructure: '/features/observability',
      backendLayout: {
        moduleRoot: '/modules/observability',
        metrics: '/modules/observability/metrics',
        streams: '/modules/observability/streams',
        collectors: '/modules/observability/collectors',
      },
      deferred: ['full APM', 'distributed tracing', 'cloud observability mandatory', 'telemetry invasiva'],
      futureThemes: ['OpenTelemetry', 'tracing', 'distributed metrics', 'AI anomaly detection'],
      mvpGoals: [
        'realtime metrics',
        'uptime panels',
        'latency charts',
        'event streams',
      ],
    };
  }
}
