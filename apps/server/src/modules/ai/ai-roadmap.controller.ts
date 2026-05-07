import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap estratégico de IA (MD20).
 * Sem integração com LLM, chaves ou telemetria — apenas contrato informativo.
 */
@ApiTags('ai')
@Controller('api/ai')
export class AiRoadmapController {
  @Get('roadmap')
  @ApiOperation({ summary: 'Estratégia e roadmap de IA (stub, sem provider)' })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    corePrinciple: string;
    useCases: string[];
    futureBackendLayout: Record<string, string>;
    futureFrontendLayout: string;
    futureUi: string[];
    futureProviders: readonly string[];
    privacyFeatures: readonly string[];
    deferred: readonly string[];
    sdkPackage: string;
  } {
    return {
      phase: 'strategy',
      md: 'MD20_JUNNY_AI_INTEGRATION_STRATEGY.md',
      description:
        'Assistência opcional para gerar pedidos, analisar respostas e acelerar integrações — sempre com controlo explícito do utilizador sobre dados e providers.',
      corePrinciple: 'junny-fully-functional-without-ai',
      useCases: [
        'generate-rest-request-from-natural-language',
        'curl-import-to-workspace',
        'response-analysis-explain-errors',
        'graphql-query-mutation-generation',
        'soap-envelope-generation',
        'openapi-to-collections',
        'auth-header-suggestions',
        'dto-schema-generation',
      ],
      futureBackendLayout: {
        root: '/modules/ai',
        providers: '/modules/ai/providers',
        services: '/modules/ai/services',
        prompts: '/modules/ai/prompts',
        dto: '/modules/ai/dto',
      },
      futureFrontendLayout: '/features/ai',
      futureUi: ['ai-sidebar', 'ai-chat', 'suggestions', 'quick-actions'],
      futureProviders: [
        'OpenAI',
        'OpenRouter',
        'Ollama',
        'Anthropic',
        'local-llm',
      ],
      privacyFeatures: [
        'local-only-mode',
        'disable-cloud-providers',
        'explicit-consent-before-send',
      ],
      deferred: [
        'mandatory-ai',
        'auto-send-data',
        'aggressive-telemetry',
        'cloud-only-dependency',
      ],
      sdkPackage: '@junny/ai-sdk',
    };
  }
}
