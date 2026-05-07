import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface EnterpriseRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  philosophy: readonly string[];
  rbacRolesPlanned: readonly string[];
  useCaseSectors: readonly string[];
  deployOptionsFuture: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  frontendStructure: string;
  architectureLayersFuture: readonly string[];
}

const ENTERPRISE_ROADMAP_FALLBACK: EnterpriseRoadmapApi = {
  phase: 'roadmap',
  md: 'MD40_JUNNY_ENTERPRISE_SELF_HOSTED_PLATFORM.md',
  description:
    'Roadmap para oferta enterprise self-hosted: deploy privado, RBAC e organizations, observabilidade essencial — alinhado a OSS coexistindo sem cloud obrigatória.',
  principles: ['oss-coexistencia', 'local-first-enterprise', 'evitar-lock-in'],
  philosophy: [
    'coexistir com open source mantendo valores do produto público',
    'respeitar local-first mesmo em ambiente corporativo',
    'preferir infra privada/on-prem onde o cliente exige controlo total',
  ],
  rbacRolesPlanned: ['Owner', 'Admin', 'Developer', 'Viewer'],
  useCaseSectors: ['bancos', 'fintech', 'governo', 'healthcare', 'empresas privadas'],
  deployOptionsFuture: ['Docker Compose', 'Kubernetes', 'Helm charts'],
  mvpGoals: [
    'self-hosted runtime',
    'RBAC',
    'organizations',
    'basic monitoring',
  ],
  deferred: [
    'billing corporativo pesado desde o primeiro dia',
    'SaaS como único modo',
    'cloud obrigatória para operar Junny enterprise',
    'telemetria invasiva obrigatória',
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

@Component({
  selector: 'app-enterprise-roadmap-page',
  standalone: true,
  templateUrl: './enterprise-roadmap.component.html',
})
export class EnterpriseRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD40_JUNNY_ENTERPRISE_SELF_HOSTED_PLATFORM.md';

  private readonly apiRoadmap = signal<EnterpriseRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): EnterpriseRoadmapApi => this.apiRoadmap() ?? ENTERPRISE_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<EnterpriseRoadmapApi>(
        `${environment.apiOrigin}/api/enterprise/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD40.',
          ),
      });
  }
}
