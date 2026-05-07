import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Plugin Marketplace — roadmap (MD39); local-first; sandbox e reviews futuros.
 */
@ApiTags('marketplace')
@Controller('api/marketplace')
export class MarketplaceRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Marketplace de plugins e ecossistema comunitário — stub MD39 (registry futuro)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    philosophy: readonly string[];
    principles: readonly string[];
    strategicGoals: readonly string[];
    primaryFlowSteps: readonly string[];
    pluginKinds: readonly { kind: string; examples: readonly string[] }[];
    plannedUiComponents: readonly string[];
    metadataExample: { name: string; version: string; author: string };
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      registry: string;
      plugins: string;
      downloads: string;
    };
    registryCapabilitiesFuture: readonly string[];
    installLifecycleFuture: readonly string[];
    compatibilityFuture: readonly string[];
    trustStrategy: readonly string[];
    securityFuture: readonly string[];
    deferredProduct: readonly string[];
    enterpriseFuture: readonly string[];
    futureThemes: readonly string[];
    uxRequirements: readonly string[];
    mvpGoals: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD39_JUNNY_PLUGIN_MARKETPLACE.md',
      description:
        'Roadmap para descoberta, instalação e gestão de plugins comunitários (protocolos, UI, IA, automação), com metadata e versions, compatibilidade futura com plugin-api-version, canais de update e foco em open source, transparência e modo local-first — sem cloud obrigatória nem telemetria invasiva no arranque.',
      philosophy: [
        'fortalecer comunidade e adoção antes de modelo comercial pesado',
        'expandir protocolos e integrações via terceiros de forma saneada por segurança',
      ],
      principles: ['local-first', 'opensource-ecosystem', 'trust-first'],
      strategicGoals: [
        'transformar Junny em plataforma extensível centrada na comunidade',
        'priorizar segurança, sandbox e permissões como evoluções planejadas',
        'disponibilizar discovery e gestão core sem monetização obrigatória',
      ],
      primaryFlowSteps: [
        'abrir marketplace',
        'procurar plugin',
        'instalar plugin',
        'utilizar no Junny',
      ],
      pluginKinds: [
        { kind: 'protocol', examples: ['MQTT', 'RabbitMQ', 'Redis Streams', 'NATS'] },
        { kind: 'UI', examples: ['dashboards', 'viewers', 'themes'] },
        { kind: 'AI', examples: ['prompts', 'generators', 'analyzers'] },
        { kind: 'automation', examples: ['workflows', 'runners', 'triggers'] },
      ],
      plannedUiComponents: [
        'MarketplaceHome',
        'PluginCard',
        'PluginDetails',
        'InstallButton',
        'PluginManager',
      ],
      metadataExample: { name: 'mqtt-plugin', version: '1.0.0', author: 'community' },
      frontendStructure: '/features/marketplace',
      backendLayout: {
        moduleRoot: '/modules/marketplace',
        registry: '/modules/marketplace/registry',
        plugins: '/modules/marketplace/plugins',
        downloads: '/modules/marketplace/downloads',
      },
      registryCapabilitiesFuture: [
        'plugin metadata',
        'versions',
        'compatibility',
        'downloads',
      ],
      installLifecycleFuture: ['install', 'update', 'uninstall', 'enable/disable'],
      compatibilityFuture: ['plugin-api-version', 'compatibility checks', 'rollback'],
      trustStrategy: ['priorizar segurança', 'transparência', 'open source'],
      securityFuture: ['sandbox futura', 'permissões', 'isolamento'],
      deferredProduct: [
        'reviews/ratings/comments agressivos no MVP inicial',
        'monetização premium como requisito',
        'telemetry invasiva',
        'dependency na cloud obrigatória',
      ],
      enterpriseFuture: ['private registries', 'internal plugins', 'enterprise extensions'],
      futureThemes: [
        'plugin analytics',
        'themes marketplace',
        'workflow marketplace',
        'AI marketplace',
      ],
      uxRequirements: ['moderna', 'limpa', 'simples', 'intuitiva', 'dark-first'],
      mvpGoals: [
        'plugin discovery',
        'install plugins',
        'update plugins',
        'enable/disable',
      ],
    };
  }
}
