import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface SyncRoadmapApi {
  phase: string;
  md: string;
  description: string;
  philosophies: readonly string[];
  syncTargetsFuture: readonly string[];
  neverSyncInitially: readonly string[];
}

@Component({
  selector: 'app-sync-roadmap-page',
  standalone: true,
  templateUrl: './sync-roadmap.component.html',
})
export class SyncRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD26_JUNNY_SYNC_ARCHITECTURE_CLOUD_STRATEGY.md';

  readonly syncFrequencyModes = ['manual', 'automatic', 'disabled'] as const;

  readonly frontendPlannedLabels = [
    'SyncSettings',
    'SyncStatus',
    'WorkspaceBackup',
    'CloudProviderSelector',
  ] as const;

  readonly apiRoadmap = signal<SyncRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<SyncRoadmapApi>(`${environment.apiOrigin}/api/sync/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
