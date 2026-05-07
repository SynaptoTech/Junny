import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    @if (href(); as link) {
      <a
        [href]="link"
        [attr.rel]="external() ? 'noopener noreferrer' : null"
        [attr.target]="external() ? '_blank' : null"
        [class]="classes()"
      >
        <ng-content />
      </a>
    } @else {
      <button type="button" [class]="classes()" [disabled]="disabled()">
        <ng-content />
      </button>
    }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly href = input<string | undefined>(undefined);
  readonly external = input(false);
  readonly disabled = input(false);

  readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40';
    switch (this.variant()) {
      case 'primary':
        return `${base} bg-junny-blue text-white shadow-lg shadow-junny-blue/25 hover:bg-blue-600 focus-visible:outline-junny-blue`;
      case 'secondary':
        return `${base} border border-white/10 bg-white/5 text-slate-100 hover:border-junny-violet/40 hover:bg-junny-violet/10 focus-visible:outline-junny-violet`;
      default:
        return `${base} text-slate-300 hover:bg-white/5 focus-visible:outline-white`;
    }
  });
}
