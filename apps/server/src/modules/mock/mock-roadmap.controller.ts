import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap do Mock Server System (MD24).
 * Sem runtime HTTP dedicado nem registo de endpoints — só contrato e visão.
 */
@ApiTags('mock')
@Controller('api/mock')
export class MockRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Mock REST local, endpoints fake e editor de respostas (stub de roadmap)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    mvpCapabilities: string[];
    defaultPort: string;
    uiLayout: string[];
    statusCodesSupported: readonly number[];
    backendLayout: Record<string, string>;
    frontendComponents: readonly string[];
    futureFeatures: readonly string[];
    deferred: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD24_JUNNY_MOCK_SERVER_SYSTEM.md',
      description:
        'Servidor mock local (localhost-first) com endpoints REST simulados, respostas personalizáveis, delay opcional e logs; base para integração com collections e exportação futura.',
      mvpCapabilities: [
        'mock-rest',
        'fake-endpoints',
        'custom-responses',
        'local-runtime',
        'mock-editor-monaco',
      ],
      defaultPort: '14050',
      uiLayout: ['Mock Endpoints', 'Response Editor', 'Server Status'],
      statusCodesSupported: [200, 201, 400, 401, 404, 500],
      backendLayout: {
        module: '/modules/mock',
        controllers: '/modules/mock/controllers',
        services: '/modules/mock/services',
        runtime: '/modules/mock/runtime',
      },
      frontendComponents: [
        'MockServerList',
        'MockEditor',
        'EndpointBuilder',
        'ResponseEditor',
        'MockStatus',
      ],
      futureFeatures: [
        'graphql-soap-websocket-mocks',
        'dynamic-responses-faker-timestamps',
        'request-to-mock-from-collections',
        'export-docker-standalone',
        'delay-ms-simulation',
      ],
      deferred: [
        'public-hosting',
        'cloud-mocks',
        'distributed-mocks',
        'ai-mock-generation',
      ],
    };
  }
}
