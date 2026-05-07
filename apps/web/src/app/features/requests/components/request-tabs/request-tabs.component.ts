import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
export interface WorkspaceTabLike {
  id: string;
  title: string;
}

@Component({
  selector: 'app-request-tabs',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="flex min-w-0 items-center gap-1 overflow-x-auto border-b border-white/5 pb-1"
    >
      @for (t of tabs(); track t.id) {
        <div
          class="group flex min-w-0 max-w-[10rem] items-center gap-1 rounded-t-lg border border-transparent px-1 py-1 transition"
          [ngClass]="{
            'border-white/10': t.id === activeId(),
            'bg-slate-900/60': t.id === activeId(),
          }"
        >
          <button
            type="button"
            class="min-w-0 flex-1 truncate px-2 py-1.5 text-left text-sm"
            [class.text-slate-200]="t.id === activeId()"
            [class.text-slate-500]="t.id !== activeId()"
            (click)="tabSelected.emit(t.id)"
          >
            {{ t.title }}
          </button>
          <button
            type="button"
            class="shrink-0 px-2 text-slate-600 opacity-0 transition group-hover:opacity-100 hover:text-rose-300"
            (click)="tabClosed.emit(t.id); $event.stopPropagation()"
            aria-label="Fechar tab"
          >
            ×
          </button>
        </div>
      }
      <button
        type="button"
        class="shrink-0 rounded-lg px-2 py-1.5 text-lg text-junny-blue hover:bg-white/5"
        (click)="tabAdded.emit()"
        title="New tab"
      >
        +
      </button>
    </div>
  `,
})
export class RequestTabsComponent {
  readonly tabs = input.required<WorkspaceTabLike[]>();
  readonly activeId = input.required<string>();
  readonly tabSelected = output<string>();
  readonly tabClosed = output<string>();
  readonly tabAdded = output<void>();
}
