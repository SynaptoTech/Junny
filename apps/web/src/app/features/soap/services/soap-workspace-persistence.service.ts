import { Injectable, signal } from '@angular/core';
import { defaultAuth } from '../../requests/models/workspace.models';
import type { SoapTabState } from '../models/soap-workspace.models';

const STORAGE_KEY = 'junny-soap-workspace-tabs-v1';

const DEFAULT_ENVELOPE = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
  </soapenv:Body>
</soapenv:Envelope>`;

function newTab(): SoapTabState {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    url: 'https://example.com/soap',
    xmlText: DEFAULT_ENVELOPE,
    headerRows: [
      { key: 'Content-Type', value: 'text/xml; charset=utf-8' },
      { key: 'SOAPAction', value: '""' },
    ],
    auth: defaultAuth(),
  };
}

@Injectable({ providedIn: 'root' })
export class SoapWorkspacePersistenceService {
  readonly tabs = signal<SoapTabState[]>([]);
  readonly activeTabId = signal<string>('');

  constructor() {
    this.hydrateFromStorage();
  }

  private hydrateFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const t = newTab();
        this.tabs.set([t]);
        this.activeTabId.set(t.id);
        return;
      }
      const parsed = JSON.parse(raw) as {
        tabs: SoapTabState[];
        activeTabId: string;
      };
      if (parsed.tabs?.length) {
        this.tabs.set(
          parsed.tabs.map((t) => ({
            ...t,
            auth: t.auth ?? defaultAuth(),
          })),
        );
        this.activeTabId.set(
          parsed.activeTabId && parsed.tabs.some((x) => x.id === parsed.activeTabId)
            ? parsed.activeTabId
            : parsed.tabs[0].id,
        );
        return;
      }
    } catch {
      /* ignore */
    }
    const t = newTab();
    this.tabs.set([t]);
    this.activeTabId.set(t.id);
  }

  persist(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tabs: this.tabs(),
        activeTabId: this.activeTabId(),
      }),
    );
  }

  addTab(): SoapTabState {
    const t = newTab();
    this.tabs.update((list) => [...list, t]);
    this.activeTabId.set(t.id);
    this.persist();
    return t;
  }

  closeTab(id: string): void {
    this.tabs.update((list) => {
      if (list.length <= 1) return list;
      const next = list.filter((t) => t.id !== id);
      if (this.activeTabId() === id) {
        this.activeTabId.set(next[0]?.id ?? '');
      }
      return next;
    });
    this.persist();
  }

  patchActive(mutator: (tab: SoapTabState) => SoapTabState): void {
    const id = this.activeTabId();
    this.tabs.update((list) =>
      list.map((t) => (t.id === id ? mutator({ ...t }) : t)),
    );
    this.persist();
  }

  setActiveTab(id: string): void {
    if (!this.tabs().some((t) => t.id === id)) return;
    this.activeTabId.set(id);
    this.persist();
  }

  loadTabState(state: SoapTabState): void {
    const existing = this.tabs().find((t) => t.id === state.id);
    if (existing) {
      this.tabs.update((list) =>
        list.map((t) => (t.id === state.id ? state : t)),
      );
    } else {
      this.tabs.update((list) => [...list, state]);
      this.activeTabId.set(state.id);
    }
    this.persist();
  }
}
