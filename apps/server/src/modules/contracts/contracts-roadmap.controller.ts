import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Contract testing + schema validation — roadmap (MD32); sem motor de validação em runtime nesta fase.
 */
@ApiTags('contracts')
@Controller('api/contracts')
export class ContractsRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'OpenAPI/GraphQL validation, breaking changes e governança — stub alinhado ao MD32',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategicGoals: readonly string[];
    capabilitiesFuture: readonly string[];
    useCases: readonly string[];
    contractTypes: readonly string[];
    mainFlowSteps: readonly string[];
    openapiValidationAreas: readonly string[];
    graphqlValidationAreas: readonly string[];
    breakingChangeSignals: readonly string[];
    backendLayout: {
      moduleRoot: string;
      validators: string;
      schemas: string;
      comparators: string;
    };
    componentsPlanned: readonly string[];
    validationResultKinds: readonly string[];
    statusVisual: readonly { id: string; label: string; colorPt: string }[];
    integrations: readonly string[];
    ciCdFuture: readonly string[];
    compareModes: readonly string[];
    uxRequirements: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
  } {
    return {
      phase: 'roadmap',
      md: 'MD32_JUNNY_CONTRACT_TESTING_SCHEMA_VALIDATION.md',
      description:
        'Roadmap para validação de contratos contra OpenAPI / GraphQL, detecção de breaking changes e integração futura com collections, runner e CI — execução local-first, sem policy engine obrigatório na v0.',
      strategicGoals: [
        'plataforma moderna de governança APIs',
        'governança APIs moderna',
      ],
      capabilitiesFuture: [
        'validar APIs',
        'validar schemas',
        'detectar breaking changes',
        'validar responses',
        'comparar contracts',
      ],
      useCases: [
        'microservices',
        'enterprise APIs',
        'fintech',
        'QA',
        'CI/CD',
        'backend governance',
      ],
      contractTypes: [
        'REST OpenAPI',
        'GraphQL Schema',
        'SOAP XML Schema futuro',
      ],
      mainFlowSteps: [
        'importar schema',
        'executar request',
        'validar response',
        'detectar inconsistências',
      ],
      openapiValidationAreas: [
        'status codes',
        'response body',
        'request body',
        'required fields',
      ],
      graphqlValidationAreas: [
        'query structure',
        'response schema',
        'required fields',
      ],
      breakingChangeSignals: [
        'removed fields',
        'changed types',
        'renamed endpoints',
      ],
      backendLayout: {
        moduleRoot: '/modules/contracts',
        validators: '/modules/contracts/validators',
        schemas: '/modules/contracts/schemas',
        comparators: '/modules/contracts/comparators',
      },
      componentsPlanned: [
        'ContractValidator',
        'SchemaViewer',
        'ValidationResults',
        'BreakingChangesPanel',
      ],
      validationResultKinds: ['passed', 'warnings', 'failed', 'missing fields'],
      statusVisual: [
        { id: 'valid', label: 'Valid', colorPt: 'Verde' },
        { id: 'warning', label: 'Warning', colorPt: 'Amarelo' },
        { id: 'invalid', label: 'Invalid', colorPt: 'Vermelho' },
      ],
      integrations: [
        'collections inteiras',
        'workflows',
        'runner',
        'Request Runner / automated validation',
      ],
      ciCdFuture: [
        'pipeline validation',
        'automated checks',
        'contract enforcement',
      ],
      compareModes: [
        'OpenAPI Schema A vs Schema B',
        'GraphQL schema diff · type changes · field changes',
      ],
      uxRequirements: [
        'extremamente visual',
        'simples',
        'clara',
        'objetiva',
      ],
      deferred: [
        'distributed validation',
        'AI schema analysis',
        'policy engine',
        'realtime governance',
      ],
      futureThemes: [
        'CI integrations',
        'GitHub checks',
        'governance dashboards',
        'approval flows',
      ],
      mvpGoals: [
        'OpenAPI validation',
        'GraphQL validation',
        'response validation',
        'basic schema diff',
      ],
      frontendStructure: '/features/contracts',
    };
  }
}
