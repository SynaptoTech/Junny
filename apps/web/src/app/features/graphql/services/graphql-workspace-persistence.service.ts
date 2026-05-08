import { Injectable, effect, inject, signal } from '@angular/core';
import { defaultAuth } from '../../requests/models/workspace.models';
import type { GraphqlTabState } from '../models/graphql-workspace.models';
import { WorkspaceContextService } from '../../../shared/services/workspace-context.service';

const LEGACY_KEY = 'junny-graphql-workspace-tabs-v1';

function storageKey(workspaceId: string): string {
  return `junny-graphql-workspace-tabs-v2:${workspaceId}`;
}

function newTab(): GraphqlTabState {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    url: 'https://countries.trevorblades.com/graphql',
    queryText: `query Example {\n  countries {\n    code\n    name\n  }\n}`,
    variablesText: '{}',
    headerRows: [{ key: 'Accept', value: 'application/json' }],
    auth: defaultAuth(),
  };
}

@Injectable({ providedIn: 'root' })
export class GraphqlWorkspacePersistenceService {
  private readonly ctx = inject(WorkspaceContextService);

  readonly tabs = signal<GraphqlTabState[]>([]);
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
        tabs: GraphqlTabState[];
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

  addTab(): GraphqlTabState {
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

  patchActive(mutator: (tab: GraphqlTabState) => GraphqlTabState): void {
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

  loadTabState(state: GraphqlTabState): void {
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
