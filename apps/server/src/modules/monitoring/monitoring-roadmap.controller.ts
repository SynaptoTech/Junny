import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * API Monitoring System — roadmap arquitetural (MD31); sem motor de checks em runtime nesta fase.
 */
@ApiTags('monitoring')
@Controller('api/monitoring')
export class MonitoringRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Uptime, health checks, dashboard e alertas — stub alinhado ao MD31',
  })
  roadmap(): {
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
    backendLayout: Record<string, string>;
    checkFrequencyPresets: readonly string[];
    latencyFields: readonly string[];
    historyThemes: readonly string[];
    alertChannelsFuture: readonly string[];
    chartTypesFuture: readonly string[];
    prismaEntitiesFuture: readonly string[];
    environments: readonly string[];
    uxRequirements: readonly string[];
    enterpriseFuture: readonly string[];
    competitorsReference: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
  } {
    return {
      phase: 'roadmap',
      md: 'MD31_JUNNY_API_MONITORING_SYSTEM.md',
      description:
        'Visão de monitoring local-first: health/uptime, latência, dashboard escuro-first e histórico mínimo — sem monitoring distribuído nem cloud obrigatória na v0.',
      strategicGoal: 'plataforma completa de operação APIs',
      notOnly: 'ferramenta desenvolvimento',
      useCases: [
        'APIs críticas',
        'fintech',
        'backend teams',
        'QA',
        'observabilidade',
      ],
      monitorTypes: ['REST', 'GraphQL', 'SOAP', 'WebSocket futuro'],
      healthCheckExample: 'GET /health',
      statusVisual: [
        { id: 'healthy', label: 'Healthy', colorPt: 'Verde' },
        { id: 'warning', label: 'Warning', colorPt: 'Amarelo' },
        { id: 'down', label: 'Down', colorPt: 'Vermelho' },
      ],
      dashboardColumns: [
        'API Name',
        'Status',
        'Latency',
        'Last Check',
      ],
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
      latencyFields: ['response-time', 'status', 'failures', 'retries futuros'],
      historyThemes: ['uptime history', 'downtime logs', 'incident timeline'],
      alertChannelsFuture: ['email', 'webhook', 'Discord futuro', 'Slack futuro'],
      chartTypesFuture: ['uptime charts', 'latency charts', 'error charts'],
      prismaEntitiesFuture: ['MonitoringChecks', 'MonitoringExecutions'],
      environments: ['Development', 'Staging', 'Production'],
      uxRequirements: ['extremamente visual', 'simples', 'limpa', 'moderna'],
      enterpriseFuture: [
        'team monitoring',
        'shared dashboards',
        'incident management',
      ],
      competitorsReference: [
        'Postman Monitoring',
        'Insomnia Monitoring',
        'Pingdom-lite',
      ],
      deferred: [
        'distributed monitoring',
        'AI anomaly detection',
        'realtime alert engine',
        'cloud mandatory monitoring',
      ],
      futureThemes: [
        'SLA dashboards',
        'incident reports',
        'webhook automations',
        'AI diagnostics',
      ],
      mvpGoals: [
        'health checks',
        'uptime status',
        'monitoring dashboard',
        'latency tracking',
      ],
      frontendStructure: '/features/monitoring',
    };
  }
}
