import { Component, input, output } from '@angular/core';
import type { KeyValueRow } from '../../models/workspace.models';

@Component({
  selector: 'app-key-value-table',
  standalone: true,
  template: `
    <div class="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
      <div
        class="flex items-center justify-between border-b border-white/5 px-3 py-2"
      >
        <span class="text-xs font-medium text-slate-400">{{ label() }}</span>
        <button
          type="button"
          class="rounded-lg px-2 py-1 text-xs text-junny-blue transition hover:bg-white/5"
          (click)="addRow()"
        >
          + Add
        </button>
      </div>
      <div class="max-h-48 overflow-y-auto">
        @for (row of rows(); track $index; let i = $index) {
          <div
            class="grid grid-cols-[1fr_1fr_auto] gap-2 border-b border-white/5 px-3 py-2 last:border-0"
          >
            <input
              class="rounded-md border border-white/10 bg-slate-900/80 px-2 py-1.5 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-junny-violet/50 focus:outline-none"
              placeholder="KEY"
              [value]="row.key"
              (input)="patchRow(i, 'key', $any($event.target).value)"
            />
            <input
              class="rounded-md border border-white/10 bg-slate-900/80 px-2 py-1.5 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-junny-violet/50 focus:outline-none"
              placeholder="VALUE"
              [value]="row.value"
              (input)="patchRow(i, 'value', $any($event.target).value)"
            />
            <button
              type="button"
              class="rounded-md px-2 text-xs text-slate-500 hover:bg-white/5 hover:text-rose-300"
              (click)="removeRow(i)"
              [attr.aria-label]="'Remove row ' + i"
            >
              ✕
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class KeyValueTableComponent {
  readonly label = input.required<string>();
  readonly rows = input.required<KeyValueRow[]>();
  readonly rowsChange = output<KeyValueRow[]>();

  private emit(rows: KeyValueRow[]): void {
    this.rowsChange.emit(rows);
  }

  addRow(): void {
    this.emit([...this.rows(), { key: '', value: '' }]);
  }

  removeRow(index: number): void {
    const next = this.rows().filter((_, i) => i !== index);
    this.emit(next.length ? next : [{ key: '', value: '' }]);
  }

  patchRow(
    index: number,
    field: keyof KeyValueRow,
    value: string,
  ): void {
    const next = this.rows().map((r, i) =>
      i === index ? { ...r, [field]: value } : r,
    );
    this.emit(next);
  }
}
