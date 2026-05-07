import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap técnico do sistema de plugins (MD19).
 * Implementação completa (loader, sandbox, marketplace) será fase posterior.
 */
@ApiTags('plugins')
@Controller('api/plugins')
export class PluginsRoadmapController {
  @Get('roadmap')
  @ApiOperation({ summary: 'Arquitetura e roadmap do plugin system (stub)' })
  roadmap(): {
    phase: string;
    md: string;
    pluginApiVersion: string;
    description: string;
    pluginKinds: readonly string[];
    plannedCapabilities: string[];
    sdkPackage: string;
    hostFolders: Record<string, string>;
    lifecycleHooks: readonly string[];
    futureUseCases: readonly string[];
    deferred: readonly string[];
  } {
    return {
      phase: 'architecture',
      md: 'MD19_JUNNY_PLUGIN_SYSTEM_ARCHITECTURE.md',
      pluginApiVersion: '0',
      description:
        'Extensibility layer for protocols, UI, automation, and AI helpers — internal-only initially; sandbox and marketplace later.',
      pluginKinds: ['protocol', 'ui', 'automation', 'ai'],
      plannedCapabilities: [
        'install-enable-disable',
        'lazy-load-modules',
        'ui-extensions-tabs-panels',
        'backend-request-response-hooks',
        'manifest-json',
        'plugin-sdk-stable-api',
      ],
      sdkPackage: '@junny/plugin-sdk',
      hostFolders: {
        repositoryPlugins: '/plugins/<name>/manifest.json',
        angularFeatures: '/apps/web/src/app/features/plugins',
      },
      lifecycleHooks: ['onLoad', 'onUnload', 'onRequest'],
      futureUseCases: [
        'mqtt',
        'rabbitmq',
        'redis-streams',
        'nats',
        'grpc',
        'ai-helpers',
        'exporters',
      ],
      deferred: ['marketplace', 'remote-plugins', 'full-sandbox', 'plugin-monetization'],
    };
  }
}
