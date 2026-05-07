import { isPlatformBrowser, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface MarketplaceRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  primaryFlowSteps: readonly string[];
  pluginKinds: readonly { kind: string; examples: readonly string[] }[];
  plannedUiComponents: readonly string[];
  metadataExample: { name: string; version: string; author: string };
  mvpGoals: readonly string[];
  deferredProduct: readonly string[];
  trustStrategy: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    registry: string;
    plugins: string;
    downloads: string;
  };
}

const MARKETPLACE_ROADMAP_FALLBACK: MarketplaceRoadmapApi = {
  phase: 'roadmap',
  md: 'MD39_JUNNY_PLUGIN_MARKETPLACE.md',
  description:
    'Roadmap para descoberta e gestão de plugins comunitários (protocolos, UI, IA, automação), registry com metadata e versions — open source first, modo local-first, sandbox e permissões planejadas.',
  principles: ['local-first', 'opensource-ecosystem', 'trust-first'],
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
  mvpGoals: [
    'plugin discovery',
    'install plugins',
    'update plugins',
    'enable/disable',
  ],
  deferredProduct: [
    'reviews/ratings/comments agressivos no MVP inicial',
    'monetização premium como requisito',
    'telemetry invasiva',
    'dependency na cloud obrigatória',
  ],
  trustStrategy: ['priorizar segurança', 'transparência', 'open source'],
  frontendStructure: '/features/marketplace',
  backendLayout: {
    moduleRoot: '/modules/marketplace',
    registry: '/modules/marketplace/registry',
    plugins: '/modules/marketplace/plugins',
    downloads: '/modules/marketplace/downloads',
  },
};

@Component({
  selector: 'app-marketplace-roadmap-page',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './marketplace-roadmap.component.html',
})
export class MarketplaceRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD39_JUNNY_PLUGIN_MARKETPLACE.md';

  private readonly apiRoadmap = signal<MarketplaceRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): MarketplaceRoadmapApi => this.apiRoadmap() ?? MARKETPLACE_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<MarketplaceRoadmapApi>(
        `${environment.apiOrigin}/api/marketplace/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD39.',
          ),
      });
  }
}
