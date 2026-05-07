import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../../core/environments/environment';

export interface GitRoadmapApi {
  phase: string;
  md: string;
  description: string;
  strategicGoal: string;
  philosophy: string;
  primaryFlowSteps: readonly string[];
  plannedLayout: readonly string[];
  gitOperationsFuture: readonly string[];
  plannedUiComponents: readonly string[];
  mvpGoals: readonly string[];
  notInitially: readonly string[];
  uxRequirements: readonly string[];
  offlineFirst: string;
  collectionsFormatFuture: string;
  frontendStructure: string;
  backendLayout: {
    moduleRoot: string;
    repositories: string;
    sync: string;
    history: string;
  };
}

const GIT_ROADMAP_FALLBACK: GitRoadmapApi = {
  phase: 'roadmap',
  md: 'MD48_JUNNY_GIT_NATIVE_COLLECTIONS.md',
  description:
    'Roadmap para tratar collections como código versionável: status/changes, commits e sync via Git — offline-first e seguro, com base para colaboração e CI/CD.',
  strategicGoal: 'plataforma moderna para versionamento de APIs',
  philosophy: 'collections como código versionável',
  primaryFlowSteps: [
    'criar collection',
    'conectar Git repository',
    'salvar mudanças',
    'realizar commit',
    'sincronizar (pull/push)',
  ],
  plannedLayout: ['Collections', 'Git Status', 'Changes', 'Commit History'],
  gitOperationsFuture: ['commit', 'push', 'pull', 'fetch', 'branches'],
  plannedUiComponents: [
    'GitStatusPanel',
    'CommitViewer',
    'DiffViewer',
    'BranchSelector',
    'SyncToolbar',
  ],
  mvpGoals: [
    'Git sync',
    'commit collections',
    'diff visualization',
    'local repository integration',
  ],
  notInitially: [
    'distributed governance',
    'cloud mandatory sync',
    'auto push',
    'telemetry repositórios',
  ],
  uxRequirements: [
    'extremamente simples',
    'moderna',
    'intuitiva',
    'familiar developers',
    'dark-first',
  ],
  offlineFirst: 'collections locais continuam prioridade',
  collectionsFormatFuture: 'collections.json',
  frontendStructure: '/features/git',
  backendLayout: {
    moduleRoot: '/modules/git',
    repositories: '/modules/git/repositories',
    sync: '/modules/git/sync',
    history: '/modules/git/history',
  },
};

@Component({
  selector: 'app-git-roadmap-page',
  standalone: true,
  templateUrl: './git-roadmap.component.html',
})
export class GitRoadmapPageComponent {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly mdRef = 'MD48_JUNNY_GIT_NATIVE_COLLECTIONS.md';

  private readonly apiRoadmap = signal<GitRoadmapApi | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly roadmapView = computed(
    (): GitRoadmapApi => this.apiRoadmap() ?? GIT_ROADMAP_FALLBACK,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<GitRoadmapApi>(`${environment.apiOrigin}/api/git/roadmap`).subscribe({
      next: (r) => this.apiRoadmap.set(r),
      error: () =>
        this.apiError.set(
          'API local indisponível — conteúdo estático abaixo segue o MD48.',
        ),
    });
  }
}
