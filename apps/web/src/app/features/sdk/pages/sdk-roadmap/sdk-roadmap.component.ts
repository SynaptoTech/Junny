import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface SdkRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoal: string;
  sdkGoals: readonly string[];
  apisFuture: readonly string[];
  sdkLanguagesFuture: readonly string[];
  sdkExample: string;
  securityRules: readonly string[];
  authFuture: readonly string[];
  backendLayout: {
    moduleRoot: string;
    routes: string;
    auth: string;
    sdk: string;
  };
  docsFuture: readonly string[];
  versioningFuture: readonly string[];
  notInitially: readonly string[];
  mvpGoals: readonly string[];
  frontendStructure: string;
}

const SDK_ROADMAP_FALLBACK: SdkRoadmapApi = {
  phase: 'roadmap',
  md: 'MD50_JUNNY_PUBLIC_SDK_DEVELOPER_PLATFORM.md',
  description:
    'Roadmap para expor APIs locais e um SDK público, transformando o Junny em developer platform: automação, extensibilidade e tooling. Local-first e com regras de permissões/vault.',
  strategicGoal: 'plataforma developer extensível internacional',
  sdkGoals: [
    'integração externa',
    'automação externa',
    'plugins externos',
    'tooling ecosystem',
    'extensões comunidade',
  ],
  apisFuture: [
    'collections',
    'requests',
    'environments',
    'workflows',
    'monitoring',
    'testing',
  ],
  sdkLanguagesFuture: ['TypeScript', 'JavaScript', 'Python (futuro)', 'Go (futuro)'],
  sdkExample: 'const client = new JunnyClient()\n\nclient.runCollection()',
  securityRules: ['respeitar permissions', 'respeitar vault', 'respeitar isolation'],
  authFuture: ['API Tokens', 'Local Auth', 'Enterprise Auth (futuro)'],
  backendLayout: {
    moduleRoot: '/modules/public-api',
    routes: '/modules/public-api/routes',
    auth: '/modules/public-api/auth',
    sdk: '/modules/public-api/sdk',
  },
  docsFuture: ['SDK examples', 'automation examples', 'workflow examples'],
  versioningFuture: ['v1', 'v2', 'v3'],
  notInitially: [
    'cloud mandatory APIs',
    'telemetry invasiva',
    'monetização agressiva',
    'closed ecosystem',
  ],
  mvpGoals: [
    'local SDK',
    'collections APIs',
    'requests execution',
    'workflows integration',
  ],
  frontendStructure: '/features/sdk',
};

@Component({
  selector: 'app-sdk-roadmap-page',
  standalone: true,
  templateUrl: './sdk-roadmap.component.html',
})
export class SdkRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD50_JUNNY_PUBLIC_SDK_DEVELOPER_PLATFORM.md';

  private readonly apiRoadmap = signal<SdkRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): SdkRoadmapApi => this.apiRoadmap() ?? SDK_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<SdkRoadmapApi>(`${environment.apiOrigin}/api/public-api/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD50.',
          ),
      });
  }
}
