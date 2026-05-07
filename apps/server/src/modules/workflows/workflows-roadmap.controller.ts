import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * AI Workflow Builder — roadmap (MD38); motors locais, sem cloud obrigatória.
 */
@ApiTags('workflows')
@Controller('api/workflows')
export class WorkflowsRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Construtor visual de workflows e motor de execução — stub MD38 (engine futuro)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    philosophy: readonly string[];
    strategicGoals: readonly string[];
    primaryFlowSteps: readonly string[];
    useCases: readonly string[];
    protocolsSupported: readonly string[];
    protocolsFuture: readonly string[];
    plannedUiComponents: readonly string[];
    aiWorkflowExamplePrompt: string;
    aiGeneratesPreview: readonly string[];
    persistenceTargets: readonly string[];
    integrations: readonly string[];
    runnerIntegrations: readonly string[];
    runtimeVariablesExamples: readonly string[];
    conditionExample: string;
    loopFutureExample: string;
    delayFutureExample: string;
    uxRequirements: readonly string[];
    securityRules: readonly string[];
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      engine: string;
      executors: string;
      runtime: string;
    };
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD38_JUNNY_AI_WORKFLOW_BUILDER.md',
      description:
        'Roadmap para canvas visual de workflows de API (REST, GraphQL, SOAP; WebSocket/Kafka/gRPC mais tarde), com chaining, condições, variáveis de runtime, prompts de IA opcionais para sugerir/gerar fluxos — foco em execução local e integrações com collections e runners, não em concorrer com ferramentas genéricas de automação empresarial.',
      principles: [
        'ia-opcional',
        'automação-integrada-ao-ecossistema-api-do-junny',
        'local-first-execution-inicialmente',
      ],
      philosophy: [
        'objetivo: não criar um n8n dentro do produto por defeito',
        'prioridade: automatizar no contexto onde o utilizador já constrói e testa pedidos',
      ],
      strategicGoals: [
        'plataforma de automação inteligente de APIs com dark-first coherent com o Junny',
        'reduzir trabalho manual, boilerplate e tempo de integração',
        'orquestração gradual sem cloud ou agentes obrigatórios no MVP',
      ],
      primaryFlowSteps: [
        'criar workflow',
        'adição de pedidos nos nós',
        'adição de condições/bifurcações',
        'execução do fluxo como um todo',
      ],
      useCases: [
        'integração entre APIs heterogéneas',
        'automation QA',
        'orquestração backend leve para equipas que já residem no Junny',
        'workflows internos e troubleshooting automatizado',
      ],
      protocolsSupported: ['REST', 'GraphQL', 'SOAP'],
      protocolsFuture: ['WebSocket', 'Kafka', 'gRPC'],
      plannedUiComponents: [
        'WorkflowCanvas',
        'WorkflowNode',
        'ConnectionLines',
        'WorkflowRunner',
        'ConditionEditor',
      ],
      aiWorkflowExamplePrompt: 'Create login workflow with token validation',
      aiGeneratesPreview: ['login request', 'token extraction', 'authenticated request'],
      persistenceTargets: ['workflows', 'nodes', 'connections', 'variables'],
      integrations: ['Collection → Workflow'],
      runnerIntegrations: ['Request Runner', 'Monitoring', 'Contract Validation'],
      runtimeVariablesExamples: ['{{response.userId}}', '{{timestamp}}', '{{random}}'],
      conditionExample: 'If status == 200',
      loopFutureExample: 'For each item',
      delayFutureExample: 'Wait 1000ms',
      uxRequirements: ['visual', 'moderna', 'intuitiva', 'potente dentro do tema dark-first'],
      securityRules: ['workflows locais no arranque', 'execução na cloud opcional/desativada inicialmente'],
      frontendStructure: '/features/workflows',
      backendLayout: {
        moduleRoot: '/modules/workflows',
        engine: '/modules/workflows/engine',
        executors: '/modules/workflows/executors',
        runtime: '/modules/workflows/runtime',
      },
      deferred: [
        'workflows distribuídos',
        'execução cloud obrigatória',
        'agentes autónomos de IA',
        'orquestração enterprise genérica tipo n8n',
      ],
      futureThemes: [
        'workflow marketplace',
        'orquestração assistida por IA',
        'cron workflows',
        'gatilhos orientados a eventos',
      ],
      mvpGoals: [
        'visual workflows',
        'request chaining',
        'basic conditions',
        'runtime variables',
      ],
    };
  }
}
