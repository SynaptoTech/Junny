import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LOCALE_STORAGE_KEY, type LocaleId } from './supported-locales';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly platformId = inject(PLATFORM_ID);

  rememberLocale(id: LocaleId): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, id);
    } catch {
      /* quota / private mode */
    }
  }

  readStoredLocale(): LocaleId | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const v = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (v === 'en' || v === 'pt-br' || v === 'es') return v;
    } catch {
      /* ignore */
    }
    return null;
  }
}
