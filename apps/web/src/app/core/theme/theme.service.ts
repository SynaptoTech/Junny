import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'junny.theme.mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  readStored(): ThemeMode | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }

  apply(mode: ThemeMode): void {
    const root = this.doc.documentElement;
    if (!root) return;
    root.dataset['theme'] = mode;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }

  set(mode: ThemeMode): void {
    this.apply(mode);
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }

  toggle(current: ThemeMode): ThemeMode {
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  }
}

