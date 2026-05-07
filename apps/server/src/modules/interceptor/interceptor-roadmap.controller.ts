import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Traffic interceptor + HTTP inspector — roadmap avançado (MD34); sem proxy MITM nesta fase.
 */
@ApiTags('interceptor')
@Controller('api/interceptor')
export class InterceptorRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Captura HTTP, inspectors e replay básico — stub alinhado ao MD34',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategicGoals: readonly string[];
    inspirations: readonly string[];
    capabilitiesFuture: readonly string[];
    mainFlowSteps: readonly string[];
    capturedTrafficFields: readonly string[];
    protocolsFuture: readonly string[];
    proxyPortExample: string;
    backendLayout: {
      moduleRoot: string;
      proxy: string;
      capture: string;
      inspectors: string;
    };
    timelineFeatures: readonly string[];
    filterKindsFuture: readonly string[];
    exportFormatsFuture: readonly string[];
    mvpGoals: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
    securityNotes: readonly string[];
    uxRequirements: readonly string[];
    frontendStructure: string;
  } {
    return {
      phase: 'roadmap',
      md: 'MD34_JUNNY_TRAFFIC_INTERCEPTOR_HTTP_INSPECTOR.md',
      description:
        'Roadmap para proxy/captura HTTP local-first, inspectors de request/response e replay básico — integrável ao client e observabilidade; tráfego permanece na máquina do utilizador, sem envio automático nem cloud proxy na v0.',
      strategicGoals: [
        'plataforma completa debugging APIs',
        'unificar API Client, Inspector, Monitoring e debugging num único produto local-first',
        'diferenciar Junny de clientes apenas HTTP tradicionais',
      ],
      inspirations: ['Charles Proxy', 'Fiddler', 'Burp Suite', 'HTTP Toolkit'],
      capabilitiesFuture: [
        'interceptar tráfego HTTP',
        'visualizar requests e responses',
        'debug APIs e inspecionar aplicações',
      ],
      mainFlowSteps: [
        'iniciar proxy local',
        'configurar proxy sistema/browser',
        'capturar tráfego pelo Junny',
        'requests em tempo quasi-real na timeline',
      ],
      capturedTrafficFields: [
        'method',
        'URL',
        'headers',
        'body',
        'response',
        'status',
        'duration',
      ],
      protocolsFuture: ['HTTP', 'HTTPS', 'WebSocket', 'GraphQL'],
      proxyPortExample: 'localhost:8888',
      backendLayout: {
        moduleRoot: '/modules/interceptor',
        proxy: '/modules/interceptor/proxy',
        capture: '/modules/interceptor/capture',
        inspectors: '/modules/interceptor/inspectors',
      },
      timelineFeatures: [
        'requests em tempo quasi-real',
        'responses em tempo quasi-real',
        'waterfall futura',
      ],
      filterKindsFuture: [
        'domain',
        'status',
        'method',
        'regex',
        'content-type',
      ],
      exportFormatsFuture: ['HAR export', 'traffic export', 'logs export'],
      mvpGoals: [
        'HTTP capture',
        'request inspector',
        'response inspector',
        'replay básico',
      ],
      deferred: [
        'MITM avançado',
        'distributed interception',
        'cloud proxy',
        'telemetry automática',
      ],
      futureThemes: [
        'HTTPS certificates e local CA (fora do MVP)',
        'mobile proxy',
        'browser integrations',
        'realtime observability enterprise',
      ],
      securityNotes: [
        'tráfego capturado permanece local',
        'nunca enviado automaticamente para terceiros',
        'privacy-first · controlo total do utilizador',
      ],
      uxRequirements: ['extremamente visual', 'moderna', 'fluida', 'profissional'],
      frontendStructure: '/features/interceptor',
    };
  }
}
