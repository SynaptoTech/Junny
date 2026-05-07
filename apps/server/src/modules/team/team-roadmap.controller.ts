import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap enterprise + team workspaces (MD29).
 * OSS continua local-first; isto só define expansão organizacional futura.
 */
@ApiTags('team')
@Controller('api/team')
export class TeamRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Workspaces partilhados, RBAC, sync de equipas e governança (stub)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    workspaceModel: readonly string[];
    rolesFuture: readonly string[];
    rbacAreasFuture: readonly string[];
    backendLayout: Record<string, string>;
    frontendStructure: string;
    auditFuture: readonly string[];
    enterpriseAuthFuture: readonly string[];
    deferred: readonly string[];
    futureThemes: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD29_JUNNY_ENTERPRISE_TEAM_WORKSPACES.md',
      description:
        'Versão enterprise adicionará valor sem degradar o núcleo open source: workspaces de equipa com membros, partilha controlada de collections/environments e RBAC antes de realtime colaborativo e self-hosted opcional.',
      principles: [
        'local-first-oss-remains-safe-default',
        'enterprise-additive-not-replacement',
        'optional-cloud-sync',
        'no-mandatory-enterprise-cloud',
      ],
      workspaceModel: ['workspace', 'collections', 'environments', 'members'],
      rolesFuture: ['owner', 'admin', 'developer', 'viewer'],
      rbacAreasFuture: [
        'collections-per-item',
        'environments-shared-secrets-scoped',
        'execution-history-scope',
      ],
      backendLayout: {
        module: '/modules/team',
        workspace: '/modules/team/workspace',
        members: '/modules/team/members',
        permissions: '/modules/team/permissions',
      },
      frontendStructure: '/features/team',
      auditFuture: ['activity-feed', 'execution-audit-team-scope'],
      enterpriseAuthFuture: ['sso', 'oauth', 'saml', 'ldap'],
      deferred: [
        'billing-subscriptions-first-class',
        'heavy-multi-tenant-saas-lock-in-default',
        'mandatory-cloud-for-oss-users',
        'invasive-enterprise-telemetry',
      ],
      futureThemes: [
        'realtime-workspace-collab',
        'api-monitoring-uptime-alerts',
        'cicd-pipeline-hooks',
        'self-hosted-enterprise-sku',
        'contract-testing-governance',
      ],
    };
  }
}
