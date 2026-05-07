import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { BRAND } from '../../core/constants/brand.constants';
import type { LocaleId } from '../../core/i18n/supported-locales';
import { getLandingCopy } from '../../core/i18n/landing.copy';
import { resolveLocaleIdFromUrl } from '../../core/i18n/resolve-locale';
import { ThemeService, type ThemeMode } from '../../core/theme/theme.service';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly brand = BRAND;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  readonly isScrolled = signal(false);
  readonly isExploreOpen = signal(false);
  readonly themeMode = signal<ThemeMode>('dark');

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
  readonly githubLabel = computed(() => (this.copy().nav.github ?? '').trim() || 'GitHub');
  readonly docsLabel = computed(() => (this.copy().nav.docs ?? '').trim() || 'Documentation');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    const update = () => this.isScrolled.set(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });

    this.themeMode.set(this.theme.readStored() ?? 'dark');
  }

  toggleExplore(): void {
    this.isExploreOpen.update((v) => !v);
  }

  closeExplore(): void {
    this.isExploreOpen.set(false);
  }

  toggleTheme(): void {
    this.themeMode.set(this.theme.toggle(this.themeMode()));
  }
}
