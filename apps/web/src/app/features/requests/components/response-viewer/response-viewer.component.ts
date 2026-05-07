import { JsonPipe, NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { tryFormatXml } from '../../../../core/utils/format-xml';
import type { RestExecuteResponse } from '../../models/workspace.models';

@Component({
  selector: 'app-response-viewer',
  standalone: true,
  imports: [JsonPipe, NgClass],
  template: `
    <div
      class="flex min-h-0 flex-1 flex-col rounded-xl border border-white/10 bg-slate-950/50"
    >
      <div
        class="flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-3"
      >
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          [ngClass]="statusPillClass()"
        >
          {{ res()?.status ?? '—' }}
        </span>
        <span class="text-xs text-slate-500"
          >{{ res()?.duration ?? 0 }} ms</span
        >
        <span class="text-xs text-slate-500">{{ sizeLabel() }}</span>
        <button
          type="button"
          class="ml-auto rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:border-junny-violet/40 hover:text-white disabled:opacity-30"
          [disabled]="!res()"
          (click)="copyBody()"
        >
          Copy body
        </button>
      </div>
      <div class="grid min-h-0 flex-1 grid-cols-1 gap-0 md:grid-cols-2">
        <div
          class="min-h-0 border-b border-white/5 p-3 md:border-b-0 md:border-r"
        >
          <p class="mb-2 text-xs font-medium text-slate-500">Headers</p>
          <pre
            class="max-h-40 overflow-auto font-mono text-xs text-slate-300"
            >{{ res()?.headers | json }}</pre
          >
        </div>
        <div class="min-h-0 p-3">
          <p class="mb-2 text-xs font-medium text-slate-500">{{ bodyHeading() }}</p>
          <pre
            class="max-h-[min(320px,40vh)] overflow-auto font-mono text-xs leading-relaxed text-slate-200"
            >{{ bodyPreview() }}</pre
          >
        </div>
      </div>
    </div>
  `,
})
export class ResponseViewerComponent {
  readonly res = input<RestExecuteResponse | null>(null);
  readonly errorText = input<string | null>(null);
  readonly bodyHeading = input<string>('Body');
  /** Quando true e `data` é string, tenta indentar como XML. */
  readonly prettyXml = input(false);

  readonly statusPillClass = computed(() => {
    const s = this.res()?.status;
    if (s === undefined) return 'bg-slate-800 text-slate-300';
    if (s >= 200 && s < 300) return 'bg-emerald-500/20 text-emerald-200';
    if (s >= 300 && s < 400) return 'bg-junny-blue/20 text-blue-200';
    if (s >= 400 && s < 500) return 'bg-amber-500/20 text-amber-200';
    return 'bg-rose-500/20 text-rose-200';
  });

  readonly sizeLabel = computed(() => {
    const d = this.res()?.data;
    try {
      const s = typeof d === 'string' ? d : JSON.stringify(d);
      return `${(s.length / 1024).toFixed(1)} KB`;
    } catch {
      return '—';
    }
  });

  readonly bodyPreview = computed(() => {
    if (this.errorText()) return this.errorText() ?? '';
    const d = this.res()?.data;
    if (d === undefined || d === null) return '';
    if (typeof d === 'string') {
      return this.prettyXml() ? tryFormatXml(d) : d;
    }
    try {
      return JSON.stringify(d, null, 2);
    } catch {
      return String(d);
    }
  });

  copyBody(): void {
    const t = this.bodyPreview();
    if (!t || typeof navigator === 'undefined') return;
    void navigator.clipboard.writeText(t);
  }
}
