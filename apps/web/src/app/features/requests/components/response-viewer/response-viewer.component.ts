import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { tryFormatXml } from '../../../../core/utils/format-xml';
import type { RestExecuteResponse } from '../../models/workspace.models';
import {
  humanSize,
  statusGroupLabel,
  statusTone,
} from '../../utils/http-method.utils';

type ResponseSection = 'body' | 'headers' | 'cookies';

interface ResponseCookie {
  name: string;
  attributes: string;
}

@Component({
  selector: 'app-response-viewer',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="flex min-h-0 flex-1 flex-col rounded-xl border border-white/10 bg-slate-950/50"
    >
      <div
        class="flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-2.5"
      >
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
          [ngClass]="statusPillClass()"
        >
          <span class="font-mono">{{ res()?.status ?? '—' }}</span>
          <span class="text-[10px] uppercase tracking-wide opacity-80">{{
            statusFamily()
          }}</span>
        </span>
        <span class="inline-flex items-center gap-1 text-xs text-slate-400">
          <span aria-hidden="true">⏱</span>
          {{ res()?.duration ?? 0 }} ms
        </span>
        <span class="inline-flex items-center gap-1 text-xs text-slate-400">
          <span aria-hidden="true">⇩</span>
          {{ sizeLabel() }}
        </span>
        @if (cookies().length) {
          <span class="inline-flex items-center gap-1 text-xs text-slate-400">
            <span aria-hidden="true">🍪</span>
            {{ cookies().length }}
            {{ cookies().length === 1 ? 'cookie' : 'cookies' }}
          </span>
        }
        <button
          type="button"
          class="ml-auto rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:border-junny-violet/40 hover:text-white disabled:opacity-30"
          [disabled]="!res()"
          (click)="copyBody()"
        >
          Copy body
        </button>
      </div>
      <div
        class="flex shrink-0 items-center gap-0 border-b border-white/5 px-2"
        role="tablist"
        aria-label="Response sections"
      >
        @for (sec of sections; track sec.id) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="section() === sec.id"
            class="border-b-2 px-3 py-2 text-xs font-medium transition hover:text-slate-200"
            [class.border-transparent]="section() !== sec.id"
            [class.text-slate-500]="section() !== sec.id"
            [class.border-junny-blue]="section() === sec.id"
            [class.text-slate-100]="section() === sec.id"
            (click)="section.set(sec.id)"
          >
            {{ sec.label }}
            @if (sec.id === 'headers' && headerCount()) {
              <span class="ml-1 text-[10px] text-slate-500"
                >({{ headerCount() }})</span
              >
            }
            @if (sec.id === 'cookies' && cookies().length) {
              <span class="ml-1 text-[10px] text-slate-500"
                >({{ cookies().length }})</span
              >
            }
          </button>
        }
      </div>
      <div class="min-h-0 flex-1 overflow-auto p-3">
        @switch (section()) {
          @case ('body') {
            <pre
              class="max-h-[min(420px,55vh)] overflow-auto font-mono text-xs leading-relaxed text-slate-200"
              >{{ bodyPreview() }}</pre
            >
          }
          @case ('headers') {
            @if (headerCount()) {
              <div
                class="overflow-hidden rounded-lg border border-white/5"
              >
                <table class="w-full border-collapse text-xs">
                  <thead class="bg-slate-900/60 text-left text-slate-500">
                    <tr>
                      <th class="px-3 py-1.5 font-medium">Header</th>
                      <th class="px-3 py-1.5 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (h of headerRows(); track h.key + '|' + $index) {
                      <tr class="border-t border-white/5">
                        <td
                          class="whitespace-nowrap px-3 py-1.5 align-top font-mono text-[11px] text-slate-400"
                        >
                          {{ h.key }}
                        </td>
                        <td
                          class="break-all px-3 py-1.5 align-top font-mono text-[11px] text-slate-200"
                        >
                          {{ h.value }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="px-1 py-2 text-xs text-slate-500">No headers.</p>
            }
          }
          @case ('cookies') {
            @if (cookies().length) {
              <div
                class="overflow-hidden rounded-lg border border-white/5"
              >
                <table class="w-full border-collapse text-xs">
                  <thead class="bg-slate-900/60 text-left text-slate-500">
                    <tr>
                      <th class="px-3 py-1.5 font-medium">Name</th>
                      <th class="px-3 py-1.5 font-medium">Attributes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (c of cookies(); track c.name + '|' + $index) {
                      <tr class="border-t border-white/5">
                        <td
                          class="whitespace-nowrap px-3 py-1.5 align-top font-mono text-[11px] text-slate-200"
                        >
                          {{ c.name }}
                        </td>
                        <td
                          class="break-all px-3 py-1.5 align-top font-mono text-[11px] text-slate-400"
                        >
                          {{ c.attributes }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="px-1 py-2 text-xs text-slate-500">No cookies set.</p>
            }
          }
        }
        @if (errorText() && section() !== 'body') {
          <pre
            class="mt-3 whitespace-pre-wrap font-mono text-xs text-rose-300"
            >{{ errorText() }}</pre
          >
        }
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

  readonly section = signal<ResponseSection>('body');

  protected readonly sections: ReadonlyArray<{
    id: ResponseSection;
    label: string;
  }> = [
    { id: 'body', label: 'Body' },
    { id: 'headers', label: 'Headers' },
    { id: 'cookies', label: 'Cookies' },
  ];

  readonly statusPillClass = computed(() => statusTone(this.res()?.status).pill);
  readonly statusFamily = computed(() => statusGroupLabel(this.res()?.status));

  readonly sizeLabel = computed(() => humanSize(this.res()?.data));

  readonly headerRows = computed(() => {
    const h = this.res()?.headers;
    if (!h) return [] as { key: string; value: string }[];
    return Object.entries(h).map(([key, value]) => ({
      key,
      value: String(value ?? ''),
    }));
  });

  readonly headerCount = computed(() => this.headerRows().length);

  readonly cookies = computed<ResponseCookie[]>(() => {
    const headers = this.res()?.headers ?? {};
    const raw =
      (headers['Set-Cookie'] as string | undefined) ??
      (headers['set-cookie'] as string | undefined);
    if (!raw) return [];
    return raw
      .split(/,(?=[^;]*?=)/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [first, ...rest] = part.split(';');
        const eq = first.indexOf('=');
        const name = eq >= 0 ? first.slice(0, eq).trim() : first.trim();
        const value = eq >= 0 ? first.slice(eq + 1).trim() : '';
        const attrs = rest.map((s) => s.trim()).filter(Boolean).join('; ');
        return {
          name,
          attributes: attrs ? `${value} · ${attrs}` : value,
        };
      });
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
