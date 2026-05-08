import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceAppHeaderComponent } from '../../../../shared/components/workspace-app-header/workspace-app-header.component';
import { TeamApiService } from '../../services/team-api.service';

@Component({
  selector: 'app-team-join-page',
  standalone: true,
  imports: [WorkspaceAppHeaderComponent],
  templateUrl: './team-join.component.html',
})
export class TeamJoinPageComponent {
  private readonly api = inject(TeamApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly done = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    const token = (this.route.snapshot.queryParamMap.get('token') ?? '').trim();
    if (!token) {
      this.loading.set(false);
      this.error.set('Link de convite inválido (token ausente).');
      return;
    }
    this.api.acceptInvite(token).subscribe({
      next: () => {
        this.loading.set(false);
        this.done.set(true);
        setTimeout(() => void this.router.navigate(['/app/team']), 600);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Não foi possível aceitar o convite (expirado, já aceito, ou token inválido).');
      },
    });
  }
}

