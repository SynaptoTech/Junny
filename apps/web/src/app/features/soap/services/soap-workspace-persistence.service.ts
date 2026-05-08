import { Injectable, effect, inject, signal } from '@angular/core';
import { defaultAuth } from '../../requests/models/workspace.models';
import type { SoapTabState } from '../models/soap-workspace.models';
import { WorkspaceContextService } from '../../../shared/services/workspace-context.service';

const LEGACY_KEY = 'junny-soap-workspace-tabs-v1';

function storageKey(workspaceId: string): string {
  return `junny-soap-workspace-tabs-v2:${workspaceId}`;
}

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
  private readonly ctx = inject(WorkspaceContextService);

  readonly tabs = signal<SoapTabState[]>([]);
  readonly activeTabId = signal<string>('');

  constructor() {
    this.migrateLegacyOnce();

    effect(() => {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      this.hydrateFromStorage(wid);
    });

    effect(() => {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      void this.tabs();
      void this.activeTabId();
      this.persist(wid);
    });
  }

  private migrateLegacyOnce(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      const key = storageKey(wid);
      if (localStorage.getItem(key)) return;
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) localStorage.setItem(key, legacy);
    } catch {
      /* ignore */
    }
  }

  private hydrateFromStorage(workspaceId: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKey(workspaceId));
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

  persist(workspaceId = this.ctx.activeWorkspaceId()): void {
    if (typeof localStorage === 'undefined') return;
    if (!workspaceId) return;
    localStorage.setItem(
      storageKey(workspaceId),
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
