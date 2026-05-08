import { Component, computed, effect, inject, input, signal } from '@angular/core';
import {
  TeamApiService,
  type WorkspaceDto,
  type WorkspaceMemberDto,
  type WorkspaceRole,
} from '../../services/team-api.service';
import { PromptDialogComponent } from '../../../../shared/components/prompt-dialog/prompt-dialog.component';

@Component({
  selector: 'app-team-workspace-detail',
  standalone: true,
  imports: [PromptDialogComponent],
  templateUrl: './team-workspace-detail.component.html',
})
export class TeamWorkspaceDetailComponent {
  private readonly api = inject(TeamApiService);

  /** Workspace atual; `null` mostra estado vazio. */
  readonly workspace = input<WorkspaceDto | null>(null);

  /** Quando `false`, omite o bloco de título (ex.: modal já mostra o nome). */
  readonly showWorkspaceHeading = input(true);

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

  readonly selectedRole = computed<WorkspaceRole>(() => {
    return (this.workspace()?.role as WorkspaceRole) ?? 'viewer';
  });

  constructor() {
    effect(() => {
      const ws = this.workspace();
      this.inviteToken.set(null);
      this.error.set(null);
      if (!ws?.id) {
        this.members.set([]);
        return;
      }
      this.reloadMembers(ws.id);
    });
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

  inviteMember(): void {
    const ws = this.workspace();
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
    const ws = this.workspace();
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
