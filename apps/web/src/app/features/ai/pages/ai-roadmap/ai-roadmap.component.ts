import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  AI_PRIVACY_PRINCIPLES,
  AI_PROVIDER_CANDIDATES,
  JUNNY_AI_ROADMAP_PHASE,
  MD20_REFERENCE,
} from '@junny/ai-sdk';
import { environment } from '../../../../core/environments/environment';

@Component({
  selector: 'app-ai-roadmap-page',
  standalone: true,
  templateUrl: './ai-roadmap.component.html',
})
export class AiRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = MD20_REFERENCE;
  readonly phaseLabel = JUNNY_AI_ROADMAP_PHASE;
  readonly providerCandidates = AI_PROVIDER_CANDIDATES;
  readonly privacyPrinciples = AI_PRIVACY_PRINCIPLES;

  readonly apiRoadmap = signal<{
    phase: string;
    corePrinciple: string;
    sdkPackage: string;
    useCases: string[];
  } | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<{
        phase: string;
        corePrinciple: string;
        sdkPackage: string;
        useCases: string[];
      }>(`${environment.apiOrigin}/api/ai/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
