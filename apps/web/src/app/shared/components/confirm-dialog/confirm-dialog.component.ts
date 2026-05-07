import { NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  computed,
  effect,
  input,
  output,
} from '@angular/core';

export type ConfirmDialogTone = 'primary' | 'danger' | 'warning';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
        (click)="onBackdropClick()"
      >
        <div
          class="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl"
          (click)="$event.stopPropagation()"
        >
          <h2
            [id]="titleId"
            class="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-100"
          >
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm"
              [ngClass]="iconClasses()"
              aria-hidden="true"
            >
              {{ iconGlyph() }}
            </span>
            {{ title() }}
          </h2>
          @if (message()) {
            <p class="mb-5 whitespace-pre-line text-sm text-slate-400">
              {{ message() }}
            </p>
          }
          <div class="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              (click)="onCancel()"
            >
              {{ cancelLabel() }}
            </button>
            <button
              type="button"
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
              [ngClass]="confirmClasses()"
              (click)="onConfirm()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly message = input<string | null>(null);
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly tone = input<ConfirmDialogTone>('primary');
  readonly dismissOnBackdrop = input(true);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly titleId = `confirm-dialog-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  protected readonly iconGlyph = computed(() => {
    switch (this.tone()) {
      case 'danger':
        return '!';
      case 'warning':
        return '⚠';
      default:
        return '?';
    }
  });

  protected readonly iconClasses = computed(() => {
    switch (this.tone()) {
      case 'danger':
        return 'bg-rose-500/15 text-rose-300';
      case 'warning':
        return 'bg-amber-500/15 text-amber-200';
      default:
        return 'bg-junny-blue/15 text-junny-blue';
    }
  });

  protected readonly confirmClasses = computed(() => {
    switch (this.tone()) {
      case 'danger':
        return 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20';
      default:
        return 'bg-junny-blue hover:bg-blue-600 shadow-lg shadow-junny-blue/25';
    }
  });

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
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.cancelled.emit();
  }

  onBackdropClick(): void {
    if (!this.dismissOnBackdrop()) return;
    this.cancelled.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }
}
