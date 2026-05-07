import { Injectable, signal } from '@angular/core';
import { defaultAuth, type WorkspaceTabState } from '../models/workspace.models';

const STORAGE_KEY = 'junny-workspace-tabs-v1';
const UI_STORAGE_KEY = 'junny-workspace-ui-v1';

function newTab(): WorkspaceTabState {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    method: 'GET',
    url: 'https://httpbin.org/get',
    headerRows: [{ key: 'Accept', value: 'application/json' }],
    paramRows: [],
    bodyText: '',
    auth: defaultAuth(),
  };
}

@Injectable({ providedIn: 'root' })
export class WorkspacePersistenceService {
  readonly tabs = signal<WorkspaceTabState[]>([]);
  readonly activeTabId = signal<string>('');
  readonly selectedEnvironmentId = signal('');
  readonly expandedCollectionId = signal<string | null>(null);

  constructor() {
    this.hydrateFromStorage();
    this.hydrateUiFromStorage();
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
        tabs: WorkspaceTabState[];
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

  private hydrateUiFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(UI_STORAGE_KEY);
      if (!raw) return;
      const u = JSON.parse(raw) as {
        selectedEnvironmentId?: string;
        expandedCollectionId?: string | null;
      };
      if (typeof u.selectedEnvironmentId === 'string') {
        this.selectedEnvironmentId.set(u.selectedEnvironmentId);
      }
      if (
        u.expandedCollectionId === null ||
        typeof u.expandedCollectionId === 'string'
      ) {
        this.expandedCollectionId.set(u.expandedCollectionId ?? null);
      }
    } catch {
      /* ignore */
    }
  }

  persistUi(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      UI_STORAGE_KEY,
      JSON.stringify({
        selectedEnvironmentId: this.selectedEnvironmentId(),
        expandedCollectionId: this.expandedCollectionId(),
      }),
    );
  }

  setSelectedEnvironmentId(id: string): void {
    this.selectedEnvironmentId.set(id);
    this.persistUi();
  }

  setExpandedCollectionId(id: string | null): void {
    this.expandedCollectionId.set(id);
    this.persistUi();
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

  addTab(): WorkspaceTabState {
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

  patchActive(mutator: (tab: WorkspaceTabState) => WorkspaceTabState): void {
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

  loadTabState(state: WorkspaceTabState): void {
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
