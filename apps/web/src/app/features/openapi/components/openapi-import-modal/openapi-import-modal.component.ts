import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  RestWorkspaceApiService,
  type ImportOpenApiResult,
} from '../../../requests/services/rest-workspace-api.service';

@Component({
  selector: 'app-openapi-import-modal',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        role="button"
        tabindex="0"
        aria-label="Fechar"
        (click)="close()"
        (keydown.enter)="close()"
        (keydown.space)="$event.preventDefault(); close()"
      >
        <div
          class="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/40"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-slate-100">
                Import OpenAPI
              </h2>
              <p class="mt-1 text-xs text-slate-500">
                Cole a URL do <code class="text-slate-400">swagger.json</code>,
                <code class="text-slate-400">openapi.json</code> ou
                <code class="text-slate-400">v3/api-docs</code>
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-slate-500 hover:bg-white/10 hover:text-slate-200"
              (click)="close()"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <div>
            <label
              class="mb-1 block text-xs font-medium text-slate-500"
              for="openapi-url"
              >URL do documento</label
            >
            <input
              id="openapi-url"
              type="url"
              class="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-junny-violet/50 focus:outline-none"
              [disabled]="importing()"
              [value]="url()"
              (input)="url.set($any($event.target).value)"
              placeholder="https://petstore.swagger.io/v2/swagger.json"
            />
          </div>

          @if (error()) {
            <p class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {{ error() }}
            </p>
          }

          @if (success()) {
            <p class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {{ success() }}
            </p>
          }

          <div class="flex justify-end gap-2 border-t border-white/5 pt-3">
            <button
              type="button"
              class="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              [disabled]="importing()"
              (click)="close()"
            >
              Fechar
            </button>
            <button
              type="button"
              class="rounded-xl bg-junny-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
              [disabled]="importing() || !url().trim()"
              [ngClass]="{ 'opacity-40': importing() }"
              (click)="runImport()"
            >
              {{ importing() ? 'A importar…' : 'Importar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class OpenApiImportModalComponent {
  private readonly api = inject(RestWorkspaceApiService);

  readonly open = input(false);

  readonly closed = output<void>();
  readonly imported = output<ImportOpenApiResult>();

  readonly url = signal('');
  readonly importing = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  close(): void {
    this.closed.emit();
  }

  runImport(): void {
    const u = this.url().trim();
    if (!u) return;
    this.importing.set(true);
    this.error.set(null);
    this.success.set(null);
    this.api.importOpenApi({ url: u }).subscribe({
      next: (res) => {
        this.importing.set(false);
        this.success.set(
          `Criado environment e ${res.stats.requestCount} pedidos em ${res.stats.tagCount} collections.`,
        );
        this.imported.emit(res);
      },
      error: (err: HttpErrorResponse) => {
        this.importing.set(false);
        const body = err.error as { message?: string | string[] } | undefined;
        const raw =
          body?.message !== undefined
            ? Array.isArray(body.message)
              ? body.message.join(', ')
              : body.message
            : err.message;
        this.error.set(raw || 'Erro ao importar');
      },
    });
  }
}
