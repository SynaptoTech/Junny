import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { BRAND } from '../../core/constants/brand.constants';
import type { LocaleId } from '../../core/i18n/supported-locales';
import { getLandingCopy } from '../../core/i18n/landing.copy';
import { resolveLocaleIdFromUrl } from '../../core/i18n/resolve-locale';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly brand = BRAND;
  readonly year = signal(new Date().getFullYear());

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  readonly localeId = computed<LocaleId>(() => resolveLocaleIdFromUrl(this.url()));
  readonly copy = computed(() => getLandingCopy(this.localeId()));
}
