import { Component, input, output } from '@angular/core';
import type { WorkspaceDto } from '../../services/team-api.service';
import { TeamWorkspaceDetailComponent } from '../team-workspace-detail/team-workspace-detail.component';

@Component({
  selector: 'app-team-workspace-modal',
  standalone: true,
  imports: [TeamWorkspaceDetailComponent],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        role="button"
        tabindex="0"
        aria-label="Fechar"
        (click)="closed.emit()"
        (keydown.enter)="closed.emit()"
        (keydown.space)="$event.preventDefault(); closed.emit()"
      >
        <div
          class="flex max-h-[min(92vh,720px)] w-full max-w-2xl flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/40"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <div class="flex shrink-0 items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-wide text-slate-500">Equipe</p>
              <h2 class="truncate text-lg font-semibold text-slate-100">
                {{ workspace()?.name ?? 'Workspace' }}
              </h2>
            </div>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-slate-500 hover:bg-white/10 hover:text-slate-200"
              (click)="closed.emit()"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
          <div
            class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-slate-950/50 p-4"
          >
            <app-team-workspace-detail
              [workspace]="workspace()"
              [showWorkspaceHeading]="false"
            />
          </div>
        </div>
      </div>
    }
  `,
})
export class TeamWorkspaceModalComponent {
  readonly open = input(false);
  readonly workspace = input<WorkspaceDto | null>(null);
  readonly closed = output<void>();
}
