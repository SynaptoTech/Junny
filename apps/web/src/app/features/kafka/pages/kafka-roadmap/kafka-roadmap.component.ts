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
  selector: 'app-kafka-roadmap-page',
  standalone: true,
  templateUrl: './kafka-roadmap.component.html',
})
export class KafkaRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  /** Exemplo de variável de ambiente no texto (evita `{{` no template). */
  readonly envVarExample = '{{broker}}';

  readonly apiRoadmap = signal<{
    phase: string;
    libraryCandidate: string;
    plannedCapabilities: string[];
  } | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{
        phase: string;
        libraryCandidate: string;
        plannedCapabilities: string[];
      }>(`${environment.apiOrigin}/api/kafka/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
