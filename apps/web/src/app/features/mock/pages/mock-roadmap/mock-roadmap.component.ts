import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface MockRoadmapApi {
  phase: string;
  md: string;
  description: string;
  mvpCapabilities: string[];
  defaultPort: string;
  uiLayout: string[];
  statusCodesSupported: readonly number[];
}

@Component({
  selector: 'app-mock-roadmap-page',
  standalone: true,
  templateUrl: './mock-roadmap.component.html',
})
export class MockRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD24_JUNNY_MOCK_SERVER_SYSTEM.md';

  /** JSON de exemplo só no TS: `{` em `<pre>` quebra o compilador de templates. */
  readonly exampleJsonBody = `[
  { "id": 1, "name": "John" }
]`;

  readonly frontendComponentLabels = [
    'MockServerList',
    'MockEditor',
    'EndpointBuilder',
    'ResponseEditor',
    'MockStatus',
  ] as const;

  readonly apiRoadmap = signal<MockRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<MockRoadmapApi>(`${environment.apiOrigin}/api/mock/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
