import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-prompt-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="labelId"
        (click)="onBackdropClick()"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl"
          (click)="$event.stopPropagation()"
        >
          <h2
            [id]="titleId"
            class="mb-3 text-lg font-semibold text-slate-100"
          >
            {{ title() }}
          </h2>
          @if (message()) {
            <p class="mb-4 whitespace-pre-line text-sm text-slate-400">
              {{ message() }}
            </p>
          }
          <label [id]="labelId" class="mb-1 block text-xs text-slate-500">
            {{ label() }}
          </label>
          <input
            #field
            autofocus
            type="text"
            class="mb-5 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-junny-violet/50 focus:outline-none"
            [attr.placeholder]="placeholder()"
            [attr.maxlength]="maxlength()"
            [value]="draft()"
            (input)="draft.set($any($event.target).value)"
            (keydown.enter)="onEnter()"
          />
          <div class="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              (click)="cancelled.emit()"
            >
              {{ cancelLabel() }}
            </button>
            <button
              type="button"
              class="rounded-xl bg-junny-blue px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-junny-blue/25 transition hover:bg-blue-600 disabled:opacity-40"
              [disabled]="confirmDisabled()"
              (click)="submit()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class PromptDialogComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly message = input<string | null>(null);
  readonly label = input('Name');
  readonly placeholder = input('');
  readonly initialValue = input('');
  readonly maxlength = input(200);
  readonly confirmLabel = input('Save');
  readonly cancelLabel = input('Cancel');
  readonly dismissOnBackdrop = input(true);
  /** When true, Confirm stays disabled while trimmed value is empty. */
  readonly requireNonEmpty = input(true);

  readonly confirmed = output<string>();
  readonly cancelled = output<void>();

  protected readonly draft = signal('');
  protected readonly titleId = `prompt-dialog-title-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
  protected readonly labelId = `prompt-dialog-label-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  @ViewChild('field') private field?: ElementRef<HTMLInputElement>;

  constructor() {
    effect((onCleanup) => {
      if (typeof document === 'undefined') return;
      if (!this.open()) return;
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      onCleanup(() => {
        document.body.style.overflow = previous;
      });
    });

    effect(() => {
      if (!this.open()) return;
      this.draft.set(this.initialValue());
      queueMicrotask(() => {
        const el = this.field?.nativeElement;
        if (el) {
          el.focus();
          el.select();
        }
      });
    });
  }

  protected confirmDisabled(): boolean {
    if (!this.requireNonEmpty()) return false;
    return !this.draft().trim();
  }

  protected onEnter(): void {
    if (this.confirmDisabled()) return;
    this.submit();
  }

  protected submit(): void {
    if (this.confirmDisabled()) return;
    this.confirmed.emit(this.draft().trim());
  }

  protected onBackdropClick(): void {
    if (!this.dismissOnBackdrop()) return;
    this.cancelled.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.cancelled.emit();
  }
}
