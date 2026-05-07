import { isPlatformBrowser } from '@angular/common';
import { computed, Injectable, inject, PLATFORM_ID, signal } from '@angular/core';

export type ThemePreference = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'junny-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly preference = signal<ThemePreference>('dark');

  readonly resolved = computed<'dark' | 'light'>(() => {
    const p = this.preference();
    if (p === 'system' && isPlatformBrowser(this.platformId)) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    if (p === 'light') return 'light';
    return 'dark';
  });

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      this.preference.set(saved);
    }
  }

  setPreference(next: ThemePreference): void {
    this.preference.set(next);
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }

  cycle(): void {
    const order: ThemePreference[] = ['dark', 'light', 'system'];
    const i = order.indexOf(this.preference());
    this.setPreference(order[(i + 1) % order.length]);
  }
}
