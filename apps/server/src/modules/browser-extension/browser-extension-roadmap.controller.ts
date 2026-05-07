import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Browser extension + request capture — roadmap (MD35); MV3/extension package fora deste stub.
 */
@ApiTags('browser-extension')
@Controller('api/browser-extension')
export class BrowserExtensionRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Captura fetch/XHR no navegador e envio para Junny local — stub MD35',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategicGoals: readonly string[];
    capabilitiesFuture: readonly string[];
    useCases: readonly string[];
    mainFlowSteps: readonly string[];
    capturesSupported: readonly string[];
    protocolsMvp: readonly string[];
    protocolsFuture: readonly string[];
    graphqlCaptureHints: readonly string[];
    inspectorFields: readonly string[];
    localIntegrationHost: string;
    extensionWorkspacePath: string;
    frontendStructure: string;
    browsersPlanned: readonly string[];
    componentsPlanned: readonly string[];
    uxFlow: readonly string[];
    filtersFuture: readonly string[];
    commsFuture: readonly string[];
    mvpGoals: readonly string[];
    deferred: readonly string[];
    securityNotes: readonly string[];
    privacyControls: readonly string[];
    futureThemes: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD35_JUNNY_BROWSER_EXTENSION_REQUEST_CAPTURE.md',
      description:
        'Roadmap para extensão de navegador que intercepta fetch/XHR, extrai operações GraphQL e envia requests para instância Junny local (ex.: porta 13050) — cloud opcional desligada por defeito e sem telemetry invasiva.',
      strategicGoals: [
        'ferramenta integrada ao navegador',
        'aproximar Junny ao workflow real de frontend',
        'unificar browser, APIs, debugging e collections num fluxo só',
      ],
      capabilitiesFuture: [
        'capturar requests do browser',
        'interceptar fetch e XHR',
        'visualizar e reenviar GraphQL',
        'empurrar pedidos selecionados para o Junny desktop/web local',
      ],
      useCases: [
        'frontend developers',
        'debugging APIs',
        'GraphQL inspection',
        'reverse engineering de frontends autorizados',
        'QA',
      ],
      mainFlowSteps: [
        'instalar extensão',
        'navegar na aplicação alvo',
        'capturar requests na extensão',
        'enviar para o Junny em execução local',
      ],
      capturesSupported: [
        'fetch',
        'XMLHttpRequest',
        'GraphQL requests',
        'headers',
        'responses',
      ],
      protocolsMvp: ['REST', 'GraphQL'],
      protocolsFuture: ['WebSocket', 'SSE', 'gRPC-web'],
      graphqlCaptureHints: [
        'operations',
        'queries',
        'mutations',
        'variables',
      ],
      inspectorFields: ['method', 'URL', 'headers', 'payload', 'response'],
      localIntegrationHost: 'localhost:13050',
      extensionWorkspacePath: '/extensions/browser',
      frontendStructure: '/features/browser-extension',
      browsersPlanned: ['Chrome', 'Edge', 'Brave', 'Firefox futuro'],
      componentsPlanned: [
        'CapturedRequestsPanel',
        'BrowserConnectionStatus',
        'RequestImporter',
        'GraphqlCaptureViewer',
      ],
      uxFlow: [
        'salvar request',
        'enviar para collection',
        'replay request',
        'gerar snippets',
      ],
      filtersFuture: [
        'ignore domains',
        'content-types',
        'regex filters',
      ],
      commsFuture: [
        'websocket local',
        'local API REST',
        'secure local communication',
      ],
      mvpGoals: [
        'capture fetch',
        'capture XHR',
        'import requests',
        'integração local',
      ],
      deferred: [
        'cloud sync',
        'analytics agressivo',
        'session replay',
        'remote capture',
      ],
      securityNotes: [
        'função local-first',
        'sem cloud obrigatória',
        'sem telemetry invasiva',
      ],
      privacyControls: [
        'domínios monitorados configuráveis',
        'ativação/desativação global da captura',
        'filtros finos sobre tráfego',
      ],
      futureThemes: [
        'DevTools panel',
        'HAR capture',
        'performance waterfall',
        'mobile browser support',
      ],
    };
  }
}
