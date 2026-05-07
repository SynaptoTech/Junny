import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * AI Response Analyzer — roadmap (MD37); IA opcional, núcleo Junny útil offline.
 */
@ApiTags('ai-analyzer')
@Controller('api/ai-analyzer')
export class AiAnalyzerRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Analisar responses / debugging assistido por IA — stub MD37 (providers futuros)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    strategicGoals: readonly string[];
    primaryFlowSteps: readonly string[];
    useCases: readonly string[];
    restAnalysisAreas: readonly string[];
    graphQlAnalysisAreas: readonly string[];
    soapAnalysisAreas: readonly string[];
    webSocketFuture: readonly string[];
    plannedUiComponents: readonly string[];
    errorCategories: readonly string[];
    suggestedFixTypes: readonly string[];
    privacyControls: readonly string[];
    integrations: readonly string[];
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      providers: string;
      prompts: string;
      services: string;
    };
    providersFuture: readonly string[];
    localInferenceFuture: readonly string[];
    promptContextFuture: readonly string[];
    uxRequirements: readonly string[];
    safetyRules: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD37_JUNNY_AI_RESPONSE_ANALYZER.md',
      description:
        'Roadmap para assistente opcional que explica erros de API (REST, GraphQL, SOAP), sugere fixes (headers, auth, payload), categoriza falhas e integra fluxo Analyze with AI às coleções — com privacy-first (controlo de envio de payloads, modo local/offline quando existir infraestrutura).',
      principles: ['ia-opcional', 'nucleo-funciona-sem-provedores', 'privacy-first'],
      strategicGoals: [
        'assistente inteligente de debugging de APIs dentro do Junny',
        'reduzir tempo de troubleshooting e onboarding em APIs complexas',
        'aumentar produtividade real sem impor IA na cloud',
      ],
      primaryFlowSteps: [
        'utilizador executa um pedido',
        'Junny deteta erro (ex.: 401 Unauthorized)',
        'utilizador clica “Analyze with AI”',
        'IA sugere causa provável, headers em falta, auth/payload/schema e próximos passos',
      ],
      useCases: [
        'onboarding a APIs novas',
        'debugging e troubleshooting',
        'aprendizado (explicação legível)',
        'ganho de produtividade quotidiano',
      ],
      restAnalysisAreas: [
        'status codes',
        'headers',
        'payloads',
        'auth',
        'responses',
      ],
      graphQlAnalysisAreas: [
        'mutations',
        'queries',
        'variables',
        'GraphQL errors',
      ],
      soapAnalysisAreas: ['SOAP faults', 'XML inválido', 'envelopes'],
      webSocketFuture: ['stream analysis', 'event debugging'],
      plannedUiComponents: [
        'AnalyzeButton',
        'AIAnalysisPanel',
        'SuggestedFixes',
        'ErrorInsights',
      ],
      errorCategories: ['auth', 'network', 'timeout', 'validation', 'schema mismatch'],
      suggestedFixTypes: [
        'missing headers',
        'auth fixes',
        'payload corrections',
        'endpoint corrections',
      ],
      privacyControls: [
        'consentimento antes de enviar payloads aos providers',
        'escolha de provider externo vs local-only',
      ],
      integrations: ['AI Insights → Save Notes (coleções/notas)'],
      frontendStructure: '/features/ai-analyzer',
      backendLayout: {
        moduleRoot: '/modules/ai-analyzer',
        providers: '/modules/ai-analyzer/providers',
        prompts: '/modules/ai-analyzer/prompts',
        services: '/modules/ai-analyzer/services',
      },
      providersFuture: ['OpenAI', 'OpenRouter', 'Ollama', 'Anthropic', 'modelos locais'],
      localInferenceFuture: ['inferência local', 'offline AI', 'CPU-first'],
      promptContextFuture: ['request context', 'response context', 'OpenAPI context', 'auth context'],
      uxRequirements: ['útil na prática', 'claro', 'objetivo', 'rápido'],
      safetyRules: [
        'nunca enviar tokens, secrets ou passwords automaticamente aos providers',
      ],
      deferred: [
        'correções autónomas não solicitadas',
        'execução automática de requests',
        'telemetria de payloads',
        'IA obrigatória na cloud',
      ],
      futureThemes: [
        'workflows de debugging assistido',
        'onboarding assistant',
        'observabilidade explicável',
        'explicação de APIs / schemas',
      ],
      mvpGoals: ['explain errors', 'analyze responses', 'suggest fixes', 'GraphQL analysis'],
    };
  }
}
