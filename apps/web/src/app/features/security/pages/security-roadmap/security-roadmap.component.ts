import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface SecurityRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  secretCategories: readonly string[];
  mvpCapabilities: string[];
}

@Component({
  selector: 'app-security-roadmap-page',
  standalone: true,
  templateUrl: './security-roadmap.component.html',
})
export class SecurityRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD25_JUNNY_SECURITY_SECRETS_ARCHITECTURE.md';

  readonly envSecretLabel = 'Secret';

  readonly uxSecretBullets = [
    'Campos mascarados por defeito',
    'Alternar Show / Hide',
    'Copiar com controlo explícito do utilizador',
  ] as const;

  readonly apiRoadmap = signal<SecurityRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<SecurityRoadmapApi>(`${environment.apiOrigin}/api/security/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
