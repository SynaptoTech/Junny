import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface TeamRoadmapApi {
  phase: string;
  md: string;
  description: string;
  principles: readonly string[];
  workspaceModel: readonly string[];
  rolesFuture: readonly string[];
}

@Component({
  selector: 'app-team-roadmap-page',
  standalone: true,
  templateUrl: './team-roadmap.component.html',
})
export class TeamRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD29_JUNNY_ENTERPRISE_TEAM_WORKSPACES.md';

  readonly apiRoadmap = signal<TeamRoadmapApi | null>(null);

  readonly defaultWorkspaceLevels = [
    'Workspace',
    'collections',
    'environments',
    'members',
  ] as const;

  /** Primeira entrada = raiz; resto indentado sob o modelo do MD29. */
  formatWorkspaceLevels(levels: readonly string[]): string {
    if (!levels.length) return '';
    const [root, ...rest] = levels;
    return [root, ...rest.map((n) => `  ${n}`)].join('\n');
  }

  readonly apiError = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http
      .get<TeamRoadmapApi>(`${environment.apiOrigin}/api/team/roadmap`)
      .subscribe({
        next: (r) => this.apiRoadmap.set(r),
        error: () =>
          this.apiError.set(
            'API local indisponível — conteúdo estático abaixo mantém-se válido.',
          ),
      });
  }
}
