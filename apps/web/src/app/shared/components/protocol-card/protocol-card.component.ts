import { Component, input } from '@angular/core';
import type { ProtocolStatus } from '../../models/protocol.model';
import { BadgeComponent } from '../badge/badge.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-protocol-card',
  standalone: true,
  imports: [CardComponent, BadgeComponent],
  template: `
    <app-card>
      <div class="flex flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold tracking-tight text-slate-50">
              {{ title() }}
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-slate-400">
              {{ description() }}
            </p>
          </div>
          <app-badge [tone]="badgeTone()">{{ badgeLabel() }}</app-badge>
        </div>
      </div>
    </app-card>
  `,
})
export class ProtocolCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly status = input.required<ProtocolStatus>();

  badgeTone(): 'accent' | 'muted' | 'warn' {
    switch (this.status()) {
      case 'available':
        return 'accent';
      case 'planned':
        return 'muted';
      default:
        return 'warn';
    }
  }

  badgeLabel(): string {
    switch (this.status()) {
      case 'available':
        return 'Available';
      case 'planned':
        return 'Planned';
      default:
        return 'Coming soon';
    }
  }
}
