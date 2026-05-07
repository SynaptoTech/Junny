import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section',
  standalone: true,
  template: `
    <section
      class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
      [attr.aria-labelledby]="title() ? labelId() : null"
    >
      @if (title()) {
        <div class="mb-10 max-w-2xl space-y-2">
          <h2
            class="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
            [id]="labelId()"
          >
            {{ title() }}
          </h2>
          @if (subtitle()) {
            <p class="text-base leading-relaxed text-slate-400">
              {{ subtitle() }}
            </p>
          }
        </div>
      }
      <ng-content />
    </section>
  `,
})
export class SectionComponent {
  readonly title = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
  readonly labelId = input<string>('section-heading');
}
