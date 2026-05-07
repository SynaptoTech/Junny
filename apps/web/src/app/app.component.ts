import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import type { LocaleId } from './core/i18n/supported-locales';
import { LANDING_LOCALES } from './core/i18n/supported-locales';
import { ThemeService, type ThemeMode } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    const router = inject(Router);
    const doc = inject(DOCUMENT);
    const theme = inject(ThemeService);

    const syncLang = (url: string) => {
      const path = url.split('?')[0].split('#')[0];
      const seg = path.replace(/^\//, '').split('/')[0];
      let id: LocaleId = 'en';
      if (seg === 'pt-br') id = 'pt-br';
      else if (seg === 'es') id = 'es';
      const match = LANDING_LOCALES.find((l) => l.id === id);
      doc.documentElement.lang = match?.htmlLang ?? 'en';
    };

    syncLang(router.url);
    router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => syncLang(e.urlAfterRedirects));

    // Theme: only touch DOM in the browser (SSR/prerender safe).
    if (typeof window !== 'undefined') {
      const stored = theme.readStored();
      theme.apply((stored ?? 'dark') satisfies ThemeMode);
    }
  }
}
