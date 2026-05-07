import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap oficial consolidado v1 (MD30) — visão produto, fases e posicionamento.
 */
@ApiTags('official')
@Controller('api/official')
export class OfficialRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary: 'Roadmap oficial v1, visão e fases (stub JSON alinhado ao MD30)',
  })
  roadmap(): {
    phase: string;
    md: string;
    title: string;
    vision: string;
    positioning: string;
    notPositioningAs: string;
    philosophy: readonly string[];
    mainGoals: readonly { id: string; labelPt: string; summaryPt: string }[];
    phases: readonly {
      id: number;
      name: string;
      objectivePt: string;
      status?: string;
      features: readonly string[];
      strategicGoalPt: string;
    }[];
    strategies: {
      openSource: string;
      cloud: string;
      ai: string;
      userControl: string;
    };
    differentiators: readonly string[];
    inspirations: readonly string[];
    exclusions: readonly string[];
    longTermVision: string;
    frontendStructure: string;
  } {
    return {
      phase: 'v1',
      md: 'MD30_JUNNY_OFFICIAL_ROADMAP_V1.md',
      title: 'Junny Official Roadmap v1',
      vision: 'Open Integration Studio',
      positioning: 'plataforma moderna extensível de integração',
      notPositioningAs: 'clone Postman',
      philosophy: [
        'open source',
        'local-first',
        'privacy-first',
        'developer-first',
        'web-first',
        'extensível',
      ],
      mainGoals: [
        { id: 'simplicity', labelPt: 'Simplicidade', summaryPt: 'Reduzir complexidade.' },
        { id: 'performance', labelPt: 'Performance', summaryPt: 'Experiência extremamente rápida.' },
        { id: 'modernity', labelPt: 'Modernidade', summaryPt: 'UX moderna premium.' },
        { id: 'extensibility', labelPt: 'Extensibilidade', summaryPt: 'Arquitetura preparada para crescimento.' },
      ],
      phases: [
        {
          id: 1,
          name: 'Foundation',
          status: 'in-progress',
          objectivePt: 'MVP moderno estável.',
          features: [
            'REST Workspace',
            'Collections',
            'Environments',
            'History',
            'Authentication',
            'OpenAPI Import',
            'branding / landing',
            'arquitetura base',
          ],
          strategicGoalPt: 'MVP sólido moderno',
        },
        {
          id: 2,
          name: 'Multi Protocol',
          objectivePt: 'Expandir protocolos.',
          features: [
            'GraphQL',
            'SOAP',
            'WebSocket',
            'gRPC',
            'Kafka roadmap',
          ],
          strategicGoalPt: 'hub integração moderno',
        },
        {
          id: 3,
          name: 'Productivity',
          objectivePt: 'Produtividade do developer.',
          features: [
            'cURL Import',
            'Code Generator',
            'Request Runner',
            'Workspace Layout',
            'Advanced History',
          ],
          strategicGoalPt: 'workflow integração profissional',
        },
        {
          id: 4,
          name: 'Mock + Automation',
          objectivePt: 'Automação e QA.',
          features: [
            'Mock Server',
            'Request Chaining',
            'Variables Runtime',
            'Workflows básicos',
          ],
          strategicGoalPt: 'além do consumo de APIs',
        },
        {
          id: 5,
          name: 'Plugins + Extensibility',
          objectivePt: 'Ecossistema extensível.',
          features: [
            'Plugin SDK',
            'Protocol Plugins',
            'UI Extensions',
            'Community Plugins',
          ],
          strategicGoalPt: 'ecossistema open source',
        },
        {
          id: 6,
          name: 'AI Integration',
          objectivePt: 'Produtividade inteligente.',
          features: [
            'AI Assistant',
            'Generate Requests',
            'Explain Errors',
            'Generate Queries',
            'Convert cURL',
          ],
          strategicGoalPt: 'integração inteligente',
        },
        {
          id: 7,
          name: 'Desktop',
          objectivePt: 'Experiência nativa premium.',
          features: [
            'Tauri',
            'Secure Storage',
            'Native Runtime',
            'Offline Advanced',
          ],
          strategicGoalPt: 'ferramenta desktop profissional',
        },
        {
          id: 8,
          name: 'Enterprise',
          objectivePt: 'Expansão enterprise.',
          features: [
            'Team Workspaces',
            'RBAC',
            'Shared Collections',
            'API Governance',
            'Monitoring futuro',
          ],
          strategicGoalPt: 'enterprise integration',
        },
      ],
      strategies: {
        openSource: 'núcleo open source',
        cloud: 'opcional',
        ai: 'opcional',
        userControl: 'controle total',
      },
      differentiators: [
        'UX moderna',
        'multi protocolos',
        'local-first',
        'IA opcional',
        'open source',
        'plugins',
        'performance',
      ],
      inspirations: ['Linear', 'Raycast', 'Vercel', 'Bruno', 'Hoppscotch'],
      exclusions: [
        'ferramenta pesada',
        'UX antiga',
        'cloud obrigatória',
        'lock-in',
        'telemetria invasiva',
      ],
      longTermVision:
        'referência moderna open source para integração de APIs — developer platform internacional.',
      frontendStructure: '/features/official',
    };
  }
}
