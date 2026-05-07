import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LocaleService } from '../../../core/i18n/locale.service';
import type { LandingLocale, LocaleId } from '../../../core/i18n/supported-locales';
import {
  DEFAULT_LOCALE_ID,
  LANDING_LOCALES,
} from '../../../core/i18n/supported-locales';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent {
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);

  readonly locales = LANDING_LOCALES;
  protected readonly open = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly currentId = computed<LocaleId>(() => this.resolveIdFromUrl(this.url()));

  readonly currentLabel = computed(() => {
    const id = this.currentId();
    const found = LANDING_LOCALES.find((l) => l.id === id);
    return found?.label ?? 'English';
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.open.set(false));
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  localeRouterLink(locale: LandingLocale): string {
    return locale.path ? `/${locale.path}` : '/';
  }

  selectLocale(locale: LandingLocale): void {
    if (locale.id !== DEFAULT_LOCALE_ID) this.localeService.rememberLocale(locale.id);
    else this.localeService.rememberLocale('en');
  }

  isActive(locale: LandingLocale): boolean {
    return this.currentId() === locale.id;
  }

  private resolveIdFromUrl(url: string): LocaleId {
    const path = url.split('?')[0].split('#')[0];
    const first = path.replace(/^\//, '').split('/')[0];
    if (first === 'pt-br') return 'pt-br';
    if (first === 'es') return 'es';
    if (first === 'en' || first === '') return 'en';
    return 'en';
  }
}
