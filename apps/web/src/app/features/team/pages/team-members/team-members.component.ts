import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceAppHeaderComponent } from '../../../../shared/components/workspace-app-header/workspace-app-header.component';
import { TeamApiService, type WorkspaceDto, type WorkspaceMemberDto, type WorkspaceRole } from '../../services/team-api.service';

@Component({
  selector: 'app-team-members-page',
  standalone: true,
  imports: [NgClass, WorkspaceAppHeaderComponent],
  templateUrl: './team-members.component.html',
})
export class TeamMembersPageComponent {
  private readonly api = inject(TeamApiService);

  readonly workspaces = signal<WorkspaceDto[]>([]);
  readonly selectedWorkspaceId = signal<string>('');
  readonly members = signal<WorkspaceMemberDto[]>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly inviteToken = signal<string | null>(null);

  readonly selectedWorkspace = computed(() => {
    const id = this.selectedWorkspaceId();
    return this.workspaces().find((w) => w.id === id) ?? null;
  });

  readonly selectedRole = computed<WorkspaceRole>(() => {
    return (this.selectedWorkspace()?.role as WorkspaceRole) ?? 'viewer';
  });

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.inviteToken.set(null);
    this.api.listMyWorkspaces().subscribe({
      next: (list) => {
        this.workspaces.set(list);
        const cur = this.selectedWorkspaceId();
        const nextId = cur && list.some((w) => w.id === cur) ? cur : (list[0]?.id ?? '');
        this.selectedWorkspaceId.set(nextId);
        if (nextId) this.reloadMembers(nextId);
        else {
          this.members.set([]);
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao carregar workspaces. Confirma login e backend.');
      },
    });
  }

  selectWorkspace(id: string): void {
    this.selectedWorkspaceId.set(id);
    this.inviteToken.set(null);
    this.reloadMembers(id);
  }

  private reloadMembers(id: string): void {
    this.loading.set(true);
    this.api.listMembers(id).subscribe({
      next: (m) => {
        this.members.set(m);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao carregar membros (precisa ser membro/owner).');
      },
    });
  }

  createWorkspace(): void {
    const name = window.prompt('Nome do workspace');
    if (!name?.trim()) return;
    this.loading.set(true);
    this.api.createWorkspace(name.trim()).subscribe({
      next: () => this.reload(),
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao criar workspace.');
      },
    });
  }

  inviteMember(): void {
    const ws = this.selectedWorkspace();
    if (!ws) return;
    if (ws.role !== 'owner') {
      this.error.set('Apenas owner pode convidar no MVP.');
      return;
    }
    const email = window.prompt('Email do membro');
    if (!email?.trim()) return;
    const roleRaw = window.prompt('Role (owner/editor/viewer)', 'viewer') ?? 'viewer';
    const role = (['owner', 'editor', 'viewer'].includes(roleRaw) ? roleRaw : 'viewer') as WorkspaceRole;
    this.loading.set(true);
    this.error.set(null);
    this.inviteToken.set(null);
    this.api.invite(ws.id, email.trim(), role).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        const token = res?.invite?.token as string | undefined;
        if (token) this.inviteToken.set(token);
        this.reloadMembers(ws.id);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao convidar membro.');
      },
    });
  }
}

