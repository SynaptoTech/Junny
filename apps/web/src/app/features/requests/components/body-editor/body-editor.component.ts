import { isPlatformBrowser, NgClass } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import type * as Monaco from 'monaco-editor';

@Component({
  selector: 'app-body-editor',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="flex flex-col gap-2"
      [class.min-h-0]="embedded()"
      [class.flex-1]="embedded()"
    >
      <div
        class="flex items-center gap-2"
        [class.justify-between]="!embedded()"
        [class.justify-end]="embedded()"
      >
        @if (!embedded()) {
          <span class="text-xs font-medium text-slate-400">{{ label() }}</span>
        }
        <button
          type="button"
          class="rounded-lg px-2 py-1 text-xs text-junny-blue hover:bg-white/5"
          (click)="formatJson()"
        >
          Format JSON
        </button>
      </div>
      <div
        #editorHost
        class="overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]"
        [ngClass]="
          embedded()
            ? 'min-h-[300px] min-h-0 flex-1'
            : 'min-h-[220px]'
        "
      ></div>
    </div>
  `,
})
export class BodyEditorComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly label = input<string>('Body');
  /** Request sub-tab layout: omit title row; taller editor */
  readonly embedded = input(false);
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('editorHost');

  private editor?: Monaco.editor.IStandaloneCodeEditor;
  private monaco?: typeof Monaco;
  private editorReady = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      void this.initMonaco();
    });

    effect(() => {
      const v = this.value();
      if (!this.editor || !this.editorReady) return;
      const cur = this.editor.getValue();
      if (cur !== v) {
        this.editor.setValue(v);
      }
    });
  }

  private async initMonaco(): Promise<void> {
    const el = this.host().nativeElement;
    this.monaco = await import('monaco-editor');
    this.editor = this.monaco.editor.create(el, {
      value: this.value(),
      language: 'json',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 13,
      scrollBeyondLastLine: false,
    });
    this.editorReady = true;
    const sub = this.editor.onDidChangeModelContent(() => {
      this.valueChange.emit(this.editor?.getValue() ?? '');
    });
    this.destroyRef.onDestroy(() => {
      sub.dispose();
      this.editor?.dispose();
    });
  }

  formatJson(): void {
    if (!this.editor) return;
    const raw = this.editor.getValue().trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      this.editor.setValue(JSON.stringify(parsed, null, 2));
    } catch {
      /* not JSON */
    }
  }
}
