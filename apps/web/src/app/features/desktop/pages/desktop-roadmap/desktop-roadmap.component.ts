import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface DesktopRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategy: readonly string[];
  tauriBenefits: readonly string[];
  targetPlatforms: readonly string[];
  distroFormatsFuture: readonly string[];
  appStructure: string;
  stackFlow: readonly string[];
  deepLinkFuture: string;
}

@Component({
  selector: 'app-desktop-roadmap-page',
  standalone: true,
  templateUrl: './desktop-roadmap.component.html',
})
export class DesktopRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD28_JUNNY_NATIVE_DESKTOP_STRATEGY.md';

  readonly apiRoadmap = signal<DesktopRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<DesktopRoadmapApi>(`${environment.apiOrigin}/api/desktop/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
