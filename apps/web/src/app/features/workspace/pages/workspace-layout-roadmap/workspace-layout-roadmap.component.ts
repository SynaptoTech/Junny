import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface WorkspaceLayoutRoadmapPresets {
  minimal: string;
  developer: string;
  advanced: string;
}

export interface WorkspaceLayoutRoadmapApi {
  phase: string;
  md: string;
  description: string;
  presets: WorkspaceLayoutRoadmapPresets;
  layoutViewsInitial: readonly string[];
  multiProtocolTargets: readonly string[];
  mvpCapabilities: readonly string[];
}

@Component({
  selector: 'app-workspace-layout-roadmap-page',
  standalone: true,
  templateUrl: './workspace-layout-roadmap.component.html',
})
export class WorkspaceLayoutRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD27_JUNNY_WORKSPACE_LAYOUT_SYSTEM.md';

  readonly shortcutsFuture = ['Ctrl + T', 'Ctrl + W', 'Ctrl + Shift + P'] as const;

  readonly frontendComponentLabels = [
    'WorkspaceLayout',
    'SplitPanel',
    'ResizeHandler',
    'TabManager',
    'WorkspaceToolbar',
  ] as const;

  readonly apiRoadmap = signal<WorkspaceLayoutRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<WorkspaceLayoutRoadmapApi>(
        `${environment.apiOrigin}/api/workspace-layout/roadmap`,
      )
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
