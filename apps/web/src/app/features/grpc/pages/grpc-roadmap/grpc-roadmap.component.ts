import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

@Component({
  selector: 'app-grpc-roadmap-page',
  standalone: true,
  templateUrl: './grpc-roadmap.component.html',
})
export class GrpcRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD21_JUNNY_GRPC_WORKSPACE.md';

  /** Exemplo metadata / host (evitar `{{` no template). */
  readonly envGrpcHost = '{{grpcHost}}';

  joinLibs(libs: string[]): string {
    return libs.join(' · ');
  }

  readonly apiRoadmap = signal<{
    phase: string;
    libraryCandidates: string[];
    plannedCapabilities: string[];
  } | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{
        phase: string;
        libraryCandidates: string[];
        plannedCapabilities: string[];
      }>(`${environment.apiOrigin}/api/grpc/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
