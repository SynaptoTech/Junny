import { Component, computed, input } from '@angular/core';

export type BadgeTone = 'accent' | 'muted' | 'warn';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="pillClasses()">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('accent');

  readonly pillClasses = computed(() => {
    const base =
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    switch (this.tone()) {
      case 'warn':
        return `${base} border border-amber-500/30 bg-amber-500/10 text-amber-200`;
      case 'muted':
        return `${base} border border-white/10 bg-white/5 text-slate-400`;
      default:
        return `${base} border border-junny-violet/30 bg-junny-violet/15 text-violet-100`;
    }
  });
}
