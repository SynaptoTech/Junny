import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Enterprise self-hosted — roadmap (MD40); coexistência com OSS; deploy privado.
 */
@ApiTags('enterprise')
@Controller('api/enterprise')
export class EnterpriseRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Plataforma enterprise self-hosted e governança — stub MD40 (runtime futuro)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    philosophy: readonly string[];
    principles: readonly string[];
    strategicGoals: readonly string[];
    useCaseSectors: readonly string[];
    deployOptionsFuture: readonly string[];
    environmentsFuture: readonly string[];
    teamWorkspaceIntegrationsFuture: readonly string[];
    authEnterpriseFuture: readonly string[];
    rbacRolesPlanned: readonly string[];
    secretsManagementFuture: readonly string[];
    auditLogsFuture: readonly string[];
    apiGovernanceFuture: readonly string[];
    monitoringThemesFuture: readonly string[];
    cicdTargetsFuture: readonly string[];
    complianceFuture: readonly string[];
    localInfrastructureThemes: readonly string[];
    uxRequirements: readonly string[];
    commercialStrategyFuture: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
    architectureLayersFuture: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD40_JUNNY_ENTERPRISE_SELF_HOSTED_PLATFORM.md',
      description:
        'Roadmap para oferta enterprise self-hosted (Docker Compose no horizonte próximo; Kubernetes/Helm depois): deploy privado, isolamento e compliance alinhados a governança de APIs — coexistindo com a linha open source local-first, sem SaaS obrigatório nem lock-in.',
      philosophy: [
        'coexistir com open source mantendo valores do produto público',
        'respeitar local-first mesmo em ambiente corporativo',
        'preferir infra privada/on-prem onde o cliente exige controlo total',
      ],
      principles: ['oss-coexistencia', 'local-first-enterprise', 'evitar-lock-in'],
      strategicGoals: [
        'plataforma enterprise moderna de integração APIs (B2B)',
        'governança, RBAC, audit e segregação quando exigidos pelo cliente',
        'ampliar alcance comercial sem sacrificar segurança e sem cloud obrigatória',
      ],
      useCaseSectors: ['bancos', 'fintech', 'governo', 'healthcare', 'empresas privadas'],
      deployOptionsFuture: ['Docker Compose', 'Kubernetes', 'Helm charts'],
      environmentsFuture: ['Development', 'Staging', 'Production'],
      teamWorkspaceIntegrationsFuture: [
        'organizations',
        'membros',
        'permissions',
        'collections partilhadas',
      ],
      authEnterpriseFuture: ['SSO', 'SAML', 'LDAP', 'OAuth enterprise'],
      rbacRolesPlanned: ['Owner', 'Admin', 'Developer', 'Viewer'],
      secretsManagementFuture: [
        'enterprise vault',
        'encrypted secrets',
        'audit trails',
      ],
      auditLogsFuture: ['user actions', 'request logs', 'governance logs'],
      apiGovernanceFuture: ['contracts', 'approvals', 'versioning', 'schema policies'],
      monitoringThemesFuture: ['uptime', 'latency', 'incidents', 'dashboards'],
      cicdTargetsFuture: ['GitHub', 'GitLab', 'Jenkins', 'Azure DevOps'],
      complianceFuture: ['LGPD', 'GDPR', 'SOC2', 'ISO standards'],
      localInfrastructureThemes: ['private networks', 'air-gapped', 'deployments isolated'],
      uxRequirements: ['moderna', 'limpa', 'rápida', 'dark-first igual ao núcleo'],
      commercialStrategyFuture: [
        'suporte premium',
        'deploy assistido',
        'enterprise plugins',
        'serviços adicionais',
      ],
      deferred: [
        'billing corporativo pesado desde o primeiro dia',
        'SaaS como único modo',
        'cloud obrigatória para operar Junny enterprise',
        'telemetria invasiva obrigatória',
      ],
      futureThemes: [
        'enterprise cloud',
        'hybrid cloud',
        'managed hosting',
        'distributed runtime',
        'multi tenant / tenant isolation avançado',
      ],
      mvpGoals: [
        'self-hosted runtime',
        'RBAC',
        'organizations',
        'basic monitoring',
      ],
      frontendStructure: '/features/enterprise',
      architectureLayersFuture: [
        'frontend enterprise',
        'backend enterprise',
        'monitoring',
        'governance',
        'RBAC',
      ],
    };
  }
}
