import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * AI OpenAPI Generator — roadmap (MD45); IA opcional; privacy-first.
 */
@ApiTags('ai-openapi')
@Controller('api/ai-openapi')
export class AiOpenapiRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Gerar OpenAPI/schemas a partir de tráfego e coleções — stub MD45 (providers futuros)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    strategicGoals: readonly string[];
    primaryFlowSteps: readonly string[];
    openapiExampleSnippet: string;
    restExamplePath: string;
    plannedUiComponents: readonly string[];
    mvpGoals: readonly string[];
    inferenceTargetsFuture: readonly string[];
    graphqlFuture: readonly string[];
    soapFuture: readonly string[];
    validationIntegrationsFuture: readonly string[];
    collectionIntegration: readonly string[];
    exportsFuture: readonly string[];
    providersFuture: readonly string[];
    deferred: readonly string[];
    safetyRules: readonly string[];
    futureThemes: readonly string[];
    uxRequirements: readonly string[];
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      providers: string;
      generators: string;
      schemas: string;
    };
  } {
    return {
      phase: 'roadmap',
      md: 'MD45_JUNNY_AI_OPENAPI_GENERATOR.md',
      description:
        'Roadmap para inferir modelos de API, gerar OpenAPI 3.x e contracts a partir de requests/responses e histórico, com fluxo Collection → Generate OpenAPI, preview YAML/JSON e export — IA sempre opcional, controlos explícitos de privacidade (payloads, providers, modo local) e sem envio automático de secrets.',
      principles: ['ia-opcional', 'privacy-first', 'schema-first'],
      strategicGoals: [
        'modelagem inteligente e reverse engineering controlado',
        'reduzir onboarding e integração manual com APIs pouco documentadas',
        'YAML/JSON e contratos gerados revisáveis antes de exportar',
      ],
      primaryFlowSteps: [
        'executar requests ou usar histórico/coleções',
        'opcionalmente enviar traces para IA (opt-in)',
        'gerar/atualizar spec OpenAPI e schemas revisáveis',
      ],
      openapiExampleSnippet:
        'openapi: 3.0.0\npaths:\n  /users:',
      restExamplePath: 'GET /users',
      plannedUiComponents: [
        'GenerateOpenAPIButton',
        'OpenAPIPreview',
        'SchemaViewer',
        'ContractBuilder',
      ],
      mvpGoals: [
        'infer OpenAPI',
        'generate schemas',
        'YAML export',
        'requests analysis',
      ],
      inferenceTargetsFuture: [
        'endpoints',
        'payloads',
        'responses',
        'auth patterns',
      ],
      graphqlFuture: [
        'GraphQL schema inference',
        'GraphQL contract generation',
      ],
      soapFuture: ['XML schema inference', 'SOAP contract generation'],
      validationIntegrationsFuture: [
        'Contract Testing',
        'API Diff',
        'Validation Engine',
      ],
      collectionIntegration: ['Collection', '↓', 'Generate OpenAPI'],
      exportsFuture: ['YAML export', 'JSON export', 'schema download'],
      providersFuture: ['OpenAI', 'OpenRouter', 'Ollama', 'Anthropic', 'local models'],
      deferred: [
        'autonomous API modeling',
        'cloud mandatory AI',
        'telemetry on payloads',
        'auto publishing schemas',
      ],
      safetyRules: [
        'nunca enviar automaticamente secrets, passwords ou tokens aos providers',
      ],
      futureThemes: [
        'architecture diagrams',
        'API topology',
        'schema evolution',
        'AI governance',
      ],
      uxRequirements: [
        'extremamente simples',
        'impressionante',
        'útil',
        'moderna',
        'dark-first',
      ],
      frontendStructure: '/features/ai-openapi',
      backendLayout: {
        moduleRoot: '/modules/ai-openapi',
        providers: '/modules/ai-openapi/providers',
        generators: '/modules/ai-openapi/generators',
        schemas: '/modules/ai-openapi/schemas',
      },
    };
  }
}
