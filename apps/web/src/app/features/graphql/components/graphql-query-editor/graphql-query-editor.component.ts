import { isPlatformBrowser } from '@angular/common';
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
  selector: 'app-graphql-query-editor',
  standalone: true,
  template: `
    <div class="flex flex-col gap-2">
      <span class="text-xs font-medium text-slate-400">Query</span>
      <div
        #editorHost
        class="min-h-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]"
      ></div>
    </div>
  `,
})
export class GraphqlQueryEditorComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

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
    const monaco = await import('monaco-editor');
    this.monaco = monaco;
    this.editor = monaco.editor.create(el, {
      value: this.value(),
      language: 'plaintext',
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
}
