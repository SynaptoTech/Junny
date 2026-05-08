import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceAppHeaderComponent } from '../../../../shared/components/workspace-app-header/workspace-app-header.component';
import { TeamApiService, type WorkspaceDto, type WorkspaceMemberDto, type WorkspaceRole } from '../../services/team-api.service';
import { PromptDialogComponent } from '../../../../shared/components/prompt-dialog/prompt-dialog.component';

@Component({
  selector: 'app-team-members-page',
  standalone: true,
  imports: [NgClass, WorkspaceAppHeaderComponent, PromptDialogComponent],
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
  readonly inviteLink = computed(() => {
    const t = this.inviteToken();
    if (!t || typeof window === 'undefined') return null;
    return `${window.location.origin}/app/team/join?token=${encodeURIComponent(t)}`;
  });

  readonly createWsPromptOpen = signal(false);
  readonly inviteEmailPromptOpen = signal(false);
  readonly inviteRolePromptOpen = signal(false);
  readonly pendingInviteEmail = signal('');

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
    this.createWsPromptOpen.set(true);
  }

  onCreateWorkspaceConfirmed(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    this.createWsPromptOpen.set(false);
    this.loading.set(true);
    this.api.createWorkspace(trimmed).subscribe({
      next: () => this.reload(),
      error: () => {
        this.loading.set(false);
        this.error.set('Falha ao criar workspace.');
      },
    });
  }

  onCreateWorkspaceCancelled(): void {
    this.createWsPromptOpen.set(false);
  }

  inviteMember(): void {
    const ws = this.selectedWorkspace();
    if (!ws) return;
    if (ws.role !== 'owner') {
      this.error.set('Apenas owner pode convidar no MVP.');
      return;
    }
    this.pendingInviteEmail.set('');
    this.inviteEmailPromptOpen.set(true);
  }

  onInviteEmailConfirmed(email: string): void {
    const trimmed = email.trim();
    if (!trimmed) return;
    this.pendingInviteEmail.set(trimmed);
    this.inviteEmailPromptOpen.set(false);
    this.inviteRolePromptOpen.set(true);
  }

  onInviteEmailCancelled(): void {
    this.inviteEmailPromptOpen.set(false);
    this.pendingInviteEmail.set('');
  }

  onInviteRoleConfirmed(roleInput: string): void {
    const ws = this.selectedWorkspace();
    if (!ws) return;
    const raw = roleInput.trim().toLowerCase();
    const role = (
      raw === 'owner' || raw === 'editor' || raw === 'viewer' ? raw : 'viewer'
    ) as WorkspaceRole;
    const email = this.pendingInviteEmail().trim();
    if (!email) return;
    this.inviteRolePromptOpen.set(false);
    this.loading.set(true);
    this.error.set(null);
    this.inviteToken.set(null);
    this.api.invite(ws.id, email, role).subscribe({
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

  copyInviteLink(): void {
    const link = this.inviteLink();
    if (!link) return;
    void navigator.clipboard?.writeText(link);
  }

  onInviteRoleCancelled(): void {
    this.inviteRolePromptOpen.set(false);
    this.pendingInviteEmail.set('');
  }
}

