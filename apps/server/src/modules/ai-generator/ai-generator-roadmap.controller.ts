import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * AI Request Generator — roadmap (MD36); IA opcional, núcleo Junny permanece útil offline.
 */
@ApiTags('ai-generator')
@Controller('api/ai-generator')
export class AiGeneratorRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Gerar REST/GraphQL/SOAP a partir de prompts — stub MD36 (providers futuros)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    strategicGoals: readonly string[];
    capabilitiesFuture: readonly string[];
    restExamplePrompt: string;
    graphQlExamplePrompt: string;
    soapExamplePrompt: string;
    generatorOutputs: readonly string[];
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      providers: string;
      prompts: string;
      services: string;
    };
    providersFuture: readonly string[];
    localModelsFuture: readonly string[];
    promptTemplatesFuture: readonly string[];
    uxRequirements: readonly string[];
    aiContextFuture: readonly string[];
    integrations: readonly string[];
    safetyRules: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD36_JUNNY_AI_REQUEST_GENERATOR.md',
      description:
        'Roadmap para assistente que transforma texto natural em pedidos REST, queries/mutations GraphQL e envelopes SOAP, com previews editáveis, integração a collections/environments/OpenAPI quando existir contexto — IA sempre opcional e com modo local-first (Ollama/llama/GGUF planejados).',
      principles: ['ia-opcional', 'nucleo-funciona-sem-provedores', 'privacy-first'],
      strategicGoals: [
        'plataforma inteligente de integração',
        'permite IA privada/local quando o utilizador quiser',
        'aumentar produtividade real — não apenas marketing surface',
      ],
      capabilitiesFuture: [
        'gerar requests REST automaticamente',
        'gerar queries/mutations GraphQL',
        'gerar XML SOAP/envelopes',
        'sugerir auth headers seguros sem expor secrets',
        'gerar payloads e parametrizações',
      ],
      restExamplePrompt: 'Create a REST request for GitHub users API',
      graphQlExamplePrompt: 'Generate GraphQL login mutation',
      soapExamplePrompt: 'Generate SOAP envelope for payment request',
      generatorOutputs: [
        'method',
        'URL',
        'headers',
        'query params',
        'body',
        'auth scaffolding (sem valores sensíveis automáticos)',
      ],
      frontendStructure: '/features/ai-generator',
      backendLayout: {
        moduleRoot: '/modules/ai-generator',
        providers: '/modules/ai-generator/providers',
        prompts: '/modules/ai-generator/prompts',
        services: '/modules/ai-generator/services',
      },
      providersFuture: [
        'OpenAI',
        'OpenRouter',
        'Ollama',
        'Anthropic',
        'modelos GGUF/locais',
      ],
      localModelsFuture: ['Ollama', 'llama.cpp', 'GGUF models', 'inferência offline'],
      promptTemplatesFuture: ['REST', 'GraphQL', 'SOAP', 'auth', 'payloads'],
      uxRequirements: ['extremamente simples', 'rápida', 'impressionante', 'produtiva'],
      aiContextFuture: ['OpenAPI context', 'collection context', 'environment context'],
      integrations: ['AI Request → Save Collection'],
      safetyRules: [
        'nunca enviar tokens, secrets ou passwords automaticamente aos providers',
      ],
      deferred: [
        'autonomous agents',
        'cloud mandatory AI',
        'telemetry prompts',
        'auto execution requests',
      ],
      futureThemes: [
        'AI workflows',
        'AI debugging/testing',
        'AI explanation de APIs públicas/contexto próprio',
      ],
      mvpGoals: [
        'generate REST',
        'generate GraphQL',
        'generate SOAP',
        'AI prompt input',
      ],
    };
  }
}
