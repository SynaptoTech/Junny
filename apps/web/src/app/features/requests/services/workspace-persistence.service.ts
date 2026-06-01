import { Injectable, effect, inject, signal } from '@angular/core';
import { defaultAuth, type WorkspaceTabState } from '../models/workspace.models';
import { workspaceTabContentFingerprint } from '../utils/workspace-tab.utils';
import { WorkspaceContextService } from '../../../shared/services/workspace-context.service';

const LEGACY_TABS_KEY = 'junny-workspace-tabs-v1';
const LEGACY_UI_KEY = 'junny-workspace-ui-v1';

function tabsKey(workspaceId: string): string {
  return `junny-workspace-tabs-v2:${workspaceId}`;
}

function uiKey(workspaceId: string): string {
  return `junny-workspace-ui-v2:${workspaceId}`;
}

function newTab(): WorkspaceTabState {
  const tab: WorkspaceTabState = {
    id: crypto.randomUUID(),
    title: 'Untitled',
    method: 'GET',
    url: 'https://httpbin.org/get',
    headerRows: [{ key: 'Accept', value: 'application/json' }],
    paramRows: [],
    bodyText: '',
    auth: defaultAuth(),
    savedFingerprint: '',
  };
  tab.savedFingerprint = workspaceTabContentFingerprint(tab);
  return tab;
}

@Injectable({ providedIn: 'root' })
export class WorkspacePersistenceService {
  private readonly ctx = inject(WorkspaceContextService);

  readonly tabs = signal<WorkspaceTabState[]>([]);
  readonly activeTabId = signal<string>('');
  readonly selectedEnvironmentId = signal('');
  readonly expandedCollectionId = signal<string | null>(null);

  constructor() {
    // Migração best-effort (v1 -> v2 no workspace ativo).
    this.migrateLegacyOnce();

    // Mantém o estado sincronizado com o workspace ativo.
    effect(() => {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      this.hydrateFromStorage(wid);
      this.hydrateUiFromStorage(wid);
    });

    // Persiste sempre que muda (no workspace ativo).
    effect(() => {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      // Touch dependencies
      void this.tabs();
      void this.activeTabId();
      this.persist(wid);
    });

    effect(() => {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      void this.selectedEnvironmentId();
      void this.expandedCollectionId();
      this.persistUi(wid);
    });
  }

  private migrateLegacyOnce(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      const targetTabsKey = tabsKey(wid);
      const targetUiKey = uiKey(wid);
      const alreadyMigrated =
        localStorage.getItem(targetTabsKey) || localStorage.getItem(targetUiKey);
      if (alreadyMigrated) return;
      const legacyTabs = localStorage.getItem(LEGACY_TABS_KEY);
      const legacyUi = localStorage.getItem(LEGACY_UI_KEY);
      if (legacyTabs) localStorage.setItem(targetTabsKey, legacyTabs);
      if (legacyUi) localStorage.setItem(targetUiKey, legacyUi);
    } catch {
      /* ignore */
    }
  }

  private hydrateFromStorage(workspaceId: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(tabsKey(workspaceId));
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

  private hydrateUiFromStorage(workspaceId: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(uiKey(workspaceId));
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

  persistUi(workspaceId = this.ctx.activeWorkspaceId()): void {
    if (typeof localStorage === 'undefined') return;
    if (!workspaceId) return;
    localStorage.setItem(
      uiKey(workspaceId),
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

  /** Limpa expandedCollectionId se o id já não existir na lista carregada. */
  reconcileExpandedCollection(
    collections: { id: string }[],
    rootFolderId?: string,
  ): void {
    const exp = this.expandedCollectionId();
    if (!exp) return;
    if (rootFolderId && exp === rootFolderId) return;
    if (!collections.some((c) => c.id === exp)) {
      this.setExpandedCollectionId(null);
    }
  }

  /** Remove collection expandida guardada (ex.: após login com outro utilizador). */
  clearStaleExpandedCollections(): void {
    if (typeof localStorage === 'undefined') {
      this.expandedCollectionId.set(null);
      return;
    }
    const prefix = 'junny-workspace-ui-v2:';
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(prefix)) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const u = JSON.parse(raw) as { expandedCollectionId?: string | null };
        if (u.expandedCollectionId) {
          u.expandedCollectionId = null;
          localStorage.setItem(key, JSON.stringify(u));
        }
      }
    } catch {
      /* ignore */
    }
    this.expandedCollectionId.set(null);
  }

  persist(workspaceId = this.ctx.activeWorkspaceId()): void {
    if (typeof localStorage === 'undefined') return;
    if (!workspaceId) return;
    localStorage.setItem(
      tabsKey(workspaceId),
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
      if (list.length <= 1) {
        const fresh = newTab();
        this.activeTabId.set(fresh.id);
        return [fresh];
      }
      const next = list.filter((t) => t.id !== id);
      if (this.activeTabId() === id) {
        this.activeTabId.set(next[0]?.id ?? '');
      }
      return next;
    });
    this.persist();
  }

  /** Fecha todas as abas e deixa apenas uma "Untitled" em branco. */
  resetTabsToBlank(): WorkspaceTabState {
    const fresh = newTab();
    this.tabs.set([fresh]);
    this.activeTabId.set(fresh.id);
    this.persist();
    return fresh;
  }

  patchActive(mutator: (tab: WorkspaceTabState) => WorkspaceTabState): void {
    const id = this.activeTabId();
    this.tabs.update((list) =>
      list.map((t) => (t.id === id ? mutator({ ...t }) : t)),
    );
    this.persist();
  }

  patchTab(
    tabId: string,
    mutator: (tab: WorkspaceTabState) => WorkspaceTabState,
  ): void {
    this.tabs.update((list) =>
      list.map((t) => (t.id === tabId ? mutator({ ...t }) : t)),
    );
    this.persist();
  }

  setActiveTab(id: string): void {
    if (!this.tabs().some((t) => t.id === id)) return;
    this.activeTabId.set(id);
    this.persist();
  }

  loadTabState(state: WorkspaceTabState): void {
    const normalized: WorkspaceTabState = {
      ...state,
      savedFingerprint:
        state.savedFingerprint ||
        workspaceTabContentFingerprint(state),
    };
    const existing = this.tabs().find((t) => t.id === normalized.id);
    if (existing) {
      this.tabs.update((list) =>
        list.map((t) => (t.id === normalized.id ? normalized : t)),
      );
    } else {
      this.tabs.update((list) => [...list, normalized]);
      this.activeTabId.set(normalized.id);
    }
    this.persist();
  }
}
