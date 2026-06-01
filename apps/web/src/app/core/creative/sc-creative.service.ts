import { Injectable, isDevMode } from '@angular/core';
import {
  JUNNY_SC_SDK_VERSION,
  resolveJunnyCreativePlacement,
} from './junny-creative-placements';

declare global {
  interface Window {
    SC_CONFIG?: {
      apiUrl?: string;
      timeoutMs?: number;
    };
    SynaptoCreative?: {
      init: () => void;
      version?: string;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class ScCreativeService {
  private loadPromise: Promise<void> | null = null;

  ensureLoaded(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = new Promise((resolve) => {
      const base = 'https://synaptocreative.com.br';
      window.SC_CONFIG = {
        apiUrl: 'https://api.synaptocreative.com.br',
        timeoutMs: 2800,
      };

      const sdkSrc = `${base}/sdk/creative.js?v=${JUNNY_SC_SDK_VERSION}`;
      const existing = document.querySelector(
        'script[data-sc-sdk]',
      ) as HTMLScriptElement | null;
      if (existing) {
        if (!existing.src.includes(`v=${JUNNY_SC_SDK_VERSION}`)) {
          existing.src = sdkSrc;
        }
        if (window.SynaptoCreative) {
          resolve();
          return;
        }
        const done = () => resolve();
        existing.addEventListener('load', done, { once: true });
        existing.addEventListener('error', done, { once: true });
        return;
      }

      const s = document.createElement('script');
      s.async = true;
      s.src = sdkSrc;
      s.setAttribute('data-sc-sdk', '1');
      s.onload = () => resolve();
      s.onerror = () => {
        if (isDevMode()) {
          console.warn('[Synapto Creative] falha ao carregar SDK');
        }
        resolve();
      };
      document.head.appendChild(s);
    });
    return this.loadPromise;
  }

  refreshSlots(): void {
    void this.ensureLoaded().then(() => {
      window.SynaptoCreative?.init();
    });
  }

  mapPlacement(placement: string): string {
    return resolveJunnyCreativePlacement(placement);
  }
}
