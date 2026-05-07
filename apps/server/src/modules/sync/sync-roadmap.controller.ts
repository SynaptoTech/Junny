import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap de sync opcional + estratégia cloud (MD26).
 * Junny mantém-se local-first; não há replicação nem providers neste stub.
 */
@ApiTags('sync')
@Controller('api/sync')
export class SyncRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Estratégia local-first com sync/cloud opcional, sem lock-in (stub)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    philosophies: readonly string[];
    syncTargetsFuture: readonly string[];
    neverSyncInitially: readonly string[];
    syncModesFuture: readonly string[];
    providerCandidatesFuture: readonly string[];
    backendLayout: Record<string, string>;
    frontendComponentsFuture: readonly string[];
    conflictHandlingFuture: readonly string[];
    deferred: readonly string[];
    enterpriseFuture: readonly string[];
  } {
    return {
      phase: 'roadmap-architecture',
      md: 'MD26_JUNNY_SYNC_ARCHITECTURE_CLOUD_STRATEGY.md',
      description:
        'Arquitetura híbrida: Local Only ou Sync Enabled; cloud agrega valor sem ser obrigatória; offline continua prioritário mesmo com sync ativo.',
      philosophies: [
        'local-first',
        'optional-cloud-no-lock-in',
        'offline-priority-even-with-sync',
        'explicit-consent-no-hidden-export',
      ],
      syncTargetsFuture: [
        'collections',
        'requests',
        'environments',
        'settings',
        'layouts-tabs-sidebar',
      ],
      neverSyncInitially: [
        'sensitive-secrets',
        'passwords',
        'local-certificates',
      ],
      syncModesFuture: ['manual', 'automatic', 'disabled'],
      providerCandidatesFuture: [
        'synapto-cloud',
        'github-gists',
        'git-sync-collections-json',
        'dropbox-future',
        'google-drive-future',
      ],
      backendLayout: {
        module: '/modules/sync',
        providers: '/modules/sync/providers',
        services: '/modules/sync/services',
        storage: '/modules/sync/storage',
      },
      frontendComponentsFuture: [
        'SyncSettings',
        'SyncStatus',
        'WorkspaceBackup',
        'CloudProviderSelector',
      ],
      conflictHandlingFuture: ['merge', 'overwrite', 'user-guided-resolution'],
      deferred: [
        'mandatory-cloud',
        'mandatory-login',
        'aggressive-auto-sync-default',
        'invasive-sync-telemetry',
      ],
      enterpriseFuture: [
        'team-sync-shared-workspaces',
        'rbac-future',
        'realtime-collaborative-editing',
      ],
    };
  }
}
