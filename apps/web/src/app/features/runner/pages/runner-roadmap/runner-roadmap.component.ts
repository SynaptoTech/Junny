import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface RunnerRoadmapApi {
  phase: string;
  md: string;
  description: string;
  mvpCapabilities: string[];
  uiLayout: string[];
  visualStatus: Record<string, string>;
}

@Component({
  selector: 'app-runner-roadmap-page',
  standalone: true,
  templateUrl: './runner-roadmap.component.html',
})
export class RunnerRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD23_JUNNY_REQUEST_RUNNER.md';

  readonly apiRoadmap = signal<RunnerRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<RunnerRoadmapApi>(`${environment.apiOrigin}/api/runner/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
