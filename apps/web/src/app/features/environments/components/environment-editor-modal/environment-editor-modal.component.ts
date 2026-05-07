import { NgClass } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { KeyValueTableComponent } from '../../../requests/components/key-value-table/key-value-table.component';
import type { KeyValueRow } from '../../../requests/models/workspace.models';
import { RestWorkspaceApiService } from '../../../requests/services/rest-workspace-api.service';

@Component({
  selector: 'app-environment-editor-modal',
  standalone: true,
  imports: [KeyValueTableComponent, NgClass],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        role="button"
        tabindex="0"
        aria-label="Close"
        (click)="close()"
        (keydown.enter)="close()"
        (keydown.space)="$event.preventDefault(); close()"
      >
        <div
          class="flex max-h-[min(90vh,560px)] w-full max-w-lg flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/40"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <div class="flex items-start justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-100">
              {{ mode() === 'create' ? 'New environment' : 'Edit environment' }}
            </h2>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-slate-500 hover:bg-white/10 hover:text-slate-200"
              (click)="close()"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div>
            <label
              class="mb-1 block text-xs font-medium text-slate-500"
              for="env-modal-name"
              >Name</label
            >
            <input
              id="env-modal-name"
              type="text"
              class="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-junny-violet/50 focus:outline-none"
              [value]="name()"
              (input)="name.set($any($event.target).value)"
              placeholder="Development"
            />
          </div>

          <div class="min-h-0 flex-1 overflow-hidden">
            <app-key-value-table
              label="Variables (e.g. baseUrl, token, …)"
              [rows]="varRows()"
              (rowsChange)="varRows.set($event)"
            />
          </div>

          @if (error()) {
            <p class="text-sm text-rose-400">{{ error() }}</p>
          }

          <div class="flex flex-wrap items-center justify-end gap-2 border-t border-white/5 pt-3">
            @if (mode() === 'edit' && environmentId()) {
              <button
                type="button"
                class="mr-auto rounded-xl border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
                [disabled]="saving()"
                (click)="remove()"
              >
                Delete
              </button>
            }
            <button
              type="button"
              class="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              [disabled]="saving()"
              (click)="close()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-xl bg-junny-violet px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
              [disabled]="saving() || !name().trim()"
              [ngClass]="{ 'opacity-40': saving() }"
              (click)="save()"
            >
              {{ saving() ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class EnvironmentEditorModalComponent {
  private readonly api = inject(RestWorkspaceApiService);

  readonly open = input(false);
  readonly mode = input<'create' | 'edit'>('create');
  readonly environmentId = input<string | null>(null);

  readonly closed = output<void>();
  readonly saved = output<void>();

  readonly name = signal('');
  readonly varRows = signal<KeyValueRow[]>([{ key: '', value: '' }]);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.open()) return;
      this.error.set(null);
      if (this.mode() === 'create') {
        this.name.set('');
        this.varRows.set([{ key: '', value: '' }]);
        return;
      }
      const id = this.environmentId();
      if (!id) return;
      this.api.getEnvironment(id).subscribe({
        next: (env) => {
          this.name.set(env.name);
          const entries = Object.entries(env.variables ?? {});
          this.varRows.set(
            entries.length
              ? entries.map(([key, value]) => ({ key, value }))
              : [{ key: '', value: '' }],
          );
        },
        error: () =>
          this.error.set('Could not load environment.'),
      });
    });
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    const n = this.name().trim();
    if (!n) return;
    const vars = rowsToRecord(this.varRows());
    this.saving.set(true);
    this.error.set(null);
    if (this.mode() === 'create') {
      this.api.createEnvironment({ name: n, variables: vars }).subscribe({
        next: () => {
          this.saving.set(false);
          this.saved.emit();
          this.close();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Failed to create.');
        },
      });
      return;
    }
    const id = this.environmentId();
    if (!id) return;
    this.api.updateEnvironment(id, { name: n, variables: vars }).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
        this.close();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Failed to save.');
      },
    });
  }

  remove(): void {
    const id = this.environmentId();
    if (!id) return;
    if (typeof window !== 'undefined' && !window.confirm('Delete this environment?')) {
      return;
    }
    this.saving.set(true);
    this.api.deleteEnvironment(id).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.emit();
        this.close();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Failed to delete.');
      },
    });
  }
}

function rowsToRecord(rows: KeyValueRow[]): Record<string, string> {
  const o: Record<string, string> = {};
  for (const r of rows) {
    if (r.key.trim()) o[r.key.trim()] = r.value;
  }
  return o;
}
