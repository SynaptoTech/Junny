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

export interface VaultRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  strategicGoals: readonly string[];
  secretTypesFuture: readonly string[];
  visualStackPlanned: readonly string[];
  categoriesFuture: readonly string[];
  securityGoals: readonly string[];
  plannedUiComponents: readonly string[];
  mvpGoals: readonly string[];
  deferred: readonly string[];
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    crypto: string;
    storage: string;
    permissions: string;
  };
}

const VAULT_ROADMAP_FALLBACK: VaultRoadmapApi = {
  phase: 'roadmap',
  md: 'MD43_JUNNY_SECRETS_VAULT_ENTERPRISE.md',
  description:
    'Roadmap para cofre enterprise compatível com local-first: encrypt, storage seguro desktop, masking e governança de credenciais — sem vault cloud obrigatório no MVP.',
  principles: [
    'local-first mesmo em modo vault enterprise',
    'minimize-exposure-and-sensitive-logs',
    'coexistência-com-opensource-junny',
  ],
  strategicGoals: [
    'integração APIs com cofre soberano para credenciais',
    'auditoria e RBAC antes de cenários públicos/multi-tenant pesados',
  ],
  secretTypesFuture: [
    'API Keys',
    'Bearer Tokens',
    'Passwords',
    'OAuth Tokens',
    'Certificates',
    'Private Keys',
  ],
  visualStackPlanned: ['Vault Explorer', 'Secret Details', 'Permissions'],
  categoriesFuture: ['Development', 'Staging', 'Production', 'Shared', 'Private'],
  securityGoals: [
    'minimizar exposição de segredos em memória/logs',
    'clipboard protection & timeouts futuros',
    'evitar fugas através de UI',
  ],
  plannedUiComponents: [
    'VaultExplorer',
    'SecretViewer',
    'SecretEditor',
    'PermissionsPanel',
    'VaultSettings',
  ],
  mvpGoals: [
    'encrypted secrets',
    'secure storage',
    'local vault',
    'secret masking',
  ],
  deferred: [
    'distributed vault obrigatório',
    'cloud vault exclusivo para operar',
    'sharing público de segredos',
    'telemetry de credenciais',
  ],
  frontendStructure: '/features/vault',
  backendLayout: {
    moduleRoot: '/modules/vault',
    crypto: '/modules/vault/crypto',
    storage: '/modules/vault/storage',
    permissions: '/modules/vault/permissions',
  },
};

@Component({
  selector: 'app-vault-roadmap-page',
  standalone: true,
  templateUrl: './vault-roadmap.component.html',
})
export class VaultRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD43_JUNNY_SECRETS_VAULT_ENTERPRISE.md';

  private readonly apiRoadmap = signal<VaultRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): VaultRoadmapApi => this.apiRoadmap() ?? VAULT_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<VaultRoadmapApi>(`${environment.apiOrigin}/api/vault/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo segue o MD43.',
          ),
      });
  }
}
