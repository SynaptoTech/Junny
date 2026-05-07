import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-xl shadow-black/20 ring-1 ring-white/5 transition duration-300 motion-safe:hover:border-junny-violet/30 motion-safe:hover:shadow-junny-violet/5"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {}
