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
  selector: 'app-codegen-roadmap-page',
  standalone: true,
  templateUrl: './codegen-roadmap.component.html',
})
export class CodegenRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD22_JUNNY_CURL_IMPORT_CODEGEN.md';

  readonly curlExample =
    'curl -X POST https://api.example.com/v1/items -H "Content-Type: application/json" -d \'{"name":"demo"}\'';

  readonly apiRoadmap = signal<{
    phase: string;
    languagesMvp: string[];
    parserTargets: string[];
  } | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{
        phase: string;
        languagesMvp: string[];
        parserTargets: string[];
      }>(`${environment.apiOrigin}/api/codegen/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
