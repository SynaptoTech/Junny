import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceAppHeaderComponent } from '../../../../shared/components/workspace-app-header/workspace-app-header.component';
import { PromptDialogComponent } from '../../../../shared/components/prompt-dialog/prompt-dialog.component';
import { WorkspaceContextService } from '../../../../shared/services/workspace-context.service';
import { TeamWorkspaceDetailComponent } from '../../components/team-workspace-detail/team-workspace-detail.component';
import { TeamApiService, type WorkspaceDto } from '../../services/team-api.service';

@Component({
  selector: 'app-team-members-page',
  standalone: true,
  imports: [
    NgClass,
    WorkspaceAppHeaderComponent,
    PromptDialogComponent,
    TeamWorkspaceDetailComponent,
  ],
  templateUrl: './team-members.component.html',
})
export class TeamMembersPageComponent {
  private readonly api = inject(TeamApiService);
  private readonly workspaceCtx = inject(WorkspaceContextService);

  readonly workspaces = signal<WorkspaceDto[]>([]);
  readonly selectedWorkspaceId = signal<string>('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly createWsPromptOpen = signal(false);

  readonly selectedWorkspace = computed(() => {
    const id = this.selectedWorkspaceId();
    return this.workspaces().find((w) => w.id === id) ?? null;
  });

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.listMyWorkspaces().subscribe({
      next: (list) => {
        this.workspaceCtx.mergeServerWorkspaces(list);
        this.workspaces.set(list);
        const cur = this.selectedWorkspaceId();
        const nextId = cur && list.some((w) => w.id === cur) ? cur : (list[0]?.id ?? '');
        this.selectedWorkspaceId.set(nextId);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao carregar workspaces. Confirma login e backend.');
      },
    });
  }

  selectWorkspace(id: string): void {
    this.selectedWorkspaceId.set(id);
  }

  createWorkspace(): void {
    this.createWsPromptOpen.set(true);
  }

  onCreateWorkspaceConfirmed(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    this.createWsPromptOpen.set(false);
    this.loading.set(true);
    this.api.createWorkspace(trimmed).subscribe({
      next: (dto) => {
        this.workspaceCtx.mergeServerWorkspaces([dto]);
        this.reload();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao criar workspace.');
      },
    });
  }

  onCreateWorkspaceCancelled(): void {
    this.createWsPromptOpen.set(false);
  }
}
