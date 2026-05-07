import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * API Diff System — roadmap (MD33); stub sem comparador runtime.
 */
@ApiTags('diff')
@Controller('api/diff')
export class DiffRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Compare OpenAPI/GraphQL, responses e breaking changes — stub MD33',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategicGoals: readonly string[];
    capabilitiesFuture: readonly string[];
    useCases: readonly string[];
    diffTypes: readonly string[];
    openapiCompareAreas: readonly string[];
    graphqlCompareAreas: readonly string[];
    responseCompareAreas: readonly string[];
    mainFlowSteps: readonly string[];
    visualDiffKinds: readonly string[];
    statusVisual: readonly { id: string; label: string; colorPt: string }[];
    breakingChangeSignals: readonly string[];
    backendLayout: {
      moduleRoot: string;
      comparators: string;
      schemas: string;
      reports: string;
    };
    componentsPlanned: readonly string[];
    reportsFuture: readonly string[];
    integrations: readonly string[];
    ciCdFuture: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
  } {
    return {
      phase: 'roadmap',
      md: 'MD33_JUNNY_API_DIFF_SYSTEM.md',
      description:
        'Roadmap para diff visual de schemas/responses OpenAPI e GraphQL, detecção de breaking changes e relatórios exportáveis — local-first e integrável depois ao runner/contracts; sem realtime governance nem motor de approvals na v0.',
      strategicGoals: [
        'ferramenta moderna de evolução APIs',
        'evolução APIs com segurança',
        'reduzir falhas produção',
      ],
      capabilitiesFuture: [
        'comparar OpenAPI schemas',
        'comparar GraphQL schemas',
        'comparar responses',
        'detectar breaking changes',
        'visualizar diferenças',
      ],
      useCases: ['CI/CD', 'QA', 'backend teams', 'governance', 'versionamento APIs'],
      diffTypes: ['OpenAPI', 'GraphQL', 'Responses'],
      openapiCompareAreas: [
        'endpoints',
        'request bodies',
        'response bodies',
        'status codes',
        'paths',
        'methods',
        'request schema',
        'response schema',
      ],
      graphqlCompareAreas: [
        'types',
        'fields',
        'queries',
        'mutations',
        'enums',
      ],
      responseCompareAreas: ['payloads', 'status', 'headers'],
      mainFlowSteps: [
        'selecionar schema A',
        'selecionar schema B',
        'executar compare',
        'visualizar diferenças',
      ],
      visualDiffKinds: ['added', 'removed', 'modified'],
      statusVisual: [
        { id: 'added', label: 'Added', colorPt: 'Verde' },
        { id: 'modified', label: 'Modified', colorPt: 'Amarelo' },
        { id: 'removed', label: 'Removed', colorPt: 'Vermelho' },
      ],
      breakingChangeSignals: [
        'endpoint removido',
        'campo removido',
        'tipo alterado',
        'response incompatível',
      ],
      backendLayout: {
        moduleRoot: '/modules/diff',
        comparators: '/modules/diff/comparators',
        schemas: '/modules/diff/schemas',
        reports: '/modules/diff/reports',
      },
      componentsPlanned: [
        'DiffViewer',
        'SchemaComparator',
        'BreakingChangesPanel',
        'ResponseCompare',
      ],
      reportsFuture: ['export reports', 'markdown reports', 'CI reports'],
      integrations: ['Request Runner', 'contract validation'],
      ciCdFuture: [
        'automated diff checks',
        'GitHub validation',
        'pipeline blocking',
      ],
      deferred: [
        'realtime governance',
        'AI diff explanation',
        'distributed compare',
        'approval engine',
      ],
      futureThemes: [
        'Git integrations',
        'PR diff comments',
        'schema history',
        'AI breaking analysis',
      ],
      mvpGoals: [
        'OpenAPI compare',
        'GraphQL compare',
        'response diff',
        'breaking changes detection',
      ],
      frontendStructure: '/features/diff',
    };
  }
}
