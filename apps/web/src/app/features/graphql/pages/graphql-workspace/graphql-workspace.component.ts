import { isPlatformBrowser, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  clearPendingHistoryReplay,
  peekPendingHistoryReplay,
  storePendingHistoryReplay,
} from '../../../../core/constants/pending-history-replay.storage';
import { historyEntryProtocol } from '../../../history/utils/history-entry-protocol';
import {
  defaultAuth,
  type KeyValueRow,
  type RequestAuthConfig,
  type RestExecuteResponse,
} from '../../../requests/models/workspace.models';
import { AuthorizationEditorComponent } from '../../../requests/components/authorization-editor/authorization-editor.component';
import { BodyEditorComponent } from '../../../requests/components/body-editor/body-editor.component';
import { KeyValueTableComponent } from '../../../requests/components/key-value-table/key-value-table.component';
import { RequestTabsComponent } from '../../../requests/components/request-tabs/request-tabs.component';
import { ResponseViewerComponent } from '../../../requests/components/response-viewer/response-viewer.component';
import { WorkspaceSidebarComponent } from '../../../requests/components/workspace-sidebar/workspace-sidebar.component';
import { EnvironmentEditorModalComponent } from '../../../environments/components/environment-editor-modal/environment-editor-modal.component';
import {
  RestWorkspaceApiService,
  type CollectionRow,
  type HistoryEntryDto,
} from '../../../requests/services/rest-workspace-api.service';
import { WorkspacePersistenceService } from '../../../requests/services/workspace-persistence.service';
import { GraphqlQueryEditorComponent } from '../../components/graphql-query-editor/graphql-query-editor.component';
import type { GraphqlTabState } from '../../models/graphql-workspace.models';
import { GraphqlWorkspacePersistenceService } from '../../services/graphql-workspace-persistence.service';
import {
  authPayload,
  normalizeHistoryAuth,
  parseAuthFromUnknown,
} from '../../../requests/utils/request-auth.utils';

const INTROSPECTION_MINIMAL = `query IntrospectionMinimal {
  __schema {
    types {
      name
      kind
    }
  }
}`;

@Component({
  selector: 'app-graphql-workspace-page',
  standalone: true,
  imports: [
    JsonPipe,
    RequestTabsComponent,
    KeyValueTableComponent,
    AuthorizationEditorComponent,
    BodyEditorComponent,
    ResponseViewerComponent,
    WorkspaceSidebarComponent,
    EnvironmentEditorModalComponent,
    GraphqlQueryEditorComponent,
  ],
  templateUrl: './graphql-workspace.component.html',
})
export class GraphqlWorkspacePageComponent {
  private readonly api = inject(RestWorkspaceApiService);
  readonly ui = inject(WorkspacePersistenceService);
  readonly gql = inject(GraphqlWorkspacePersistenceService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loading = signal(false);
  readonly response = signal<RestExecuteResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly collections = signal<CollectionRow[]>([]);
  readonly environments = signal<
    { id: string; name: string; variables: Record<string, string> }[]
  >([]);
  readonly expandedRequests = signal<
    | {
        id: string;
        method: string;
        url: string;
        headers: unknown;
        params?: unknown;
        body: string | null;
        tag?: string | null;
        protocol?: string;
        graphqlVariables?: unknown;
        authConfig?: unknown;
      }[]
    | null
  >(null);
  readonly historyReloadTick = signal(0);
  readonly saveCollectionId = signal('');

  readonly envModalOpen = signal(false);
  readonly envModalMode = signal<'create' | 'edit'>('create');
  readonly envModalEditingId = signal<string | null>(null);

  readonly activeTab = computed(
    () =>
      this.gql
        .tabs()
        .find((t) => t.id === this.gql.activeTabId()) ?? null,
  );

  readonly graphqlErrors = computed(() => {
    const d = this.response()?.data;
    if (!d || typeof d !== 'object') return null;
    const err = (d as { errors?: unknown }).errors;
    return Array.isArray(err) && err.length ? err : null;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshMeta();
    }
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const pending = peekPendingHistoryReplay();
      if (!pending || typeof pending !== 'object') return;
      const entry = pending as HistoryEntryDto;
      if (historyEntryProtocol(entry) !== 'GRAPHQL') return;
      clearPendingHistoryReplay();
      this.pickHistory(entry);
    });
  }

  refreshMeta(): void {
    this.api.listCollections().subscribe((c) => this.collections.set(c));
    this.api
      .listEnvironments()
      .subscribe((e) => this.environments.set(e ?? []));
    this.historyReloadTick.update((n) => n + 1);
  }

  onReplayHistory(entry: HistoryEntryDto): void {
    const p = historyEntryProtocol(entry);
    if (p === 'REST') {
      storePendingHistoryReplay(entry);
      void this.router.navigate(['/app']);
      return;
    }
    if (p === 'SOAP') {
      storePendingHistoryReplay(entry);
      void this.router.navigate(['/app/soap']);
      return;
    }
    if (p === 'WEBSOCKET') {
      void this.router.navigate(['/app/websocket']);
      return;
    }
    this.pickHistory(entry);
  }

  openEnvironmentCreate(): void {
    this.envModalMode.set('create');
    this.envModalEditingId.set(null);
    this.envModalOpen.set(true);
  }

  openEnvironmentEdit(id: string): void {
    if (!id) return;
    this.envModalMode.set('edit');
    this.envModalEditingId.set(id);
    this.envModalOpen.set(true);
  }

  onEnvironmentSaved(): void {
    this.refreshMeta();
  }

  onSelectTab(id: string): void {
    this.gql.setActiveTab(id);
  }

  onCloseTab(id: string): void {
    this.gql.closeTab(id);
  }

  addTab(): void {
    this.gql.addTab();
  }

  updateUrl(url: string): void {
    this.gql.patchActive((t) => ({ ...t, url, title: shortTitle(url) }));
  }

  onHeadersChange(rows: KeyValueRow[]): void {
    this.gql.patchActive((t) => ({ ...t, headerRows: rows }));
  }

  onAuthChange(auth: RequestAuthConfig): void {
    this.gql.patchActive((t) => ({ ...t, auth }));
  }

  onQueryChange(text: string): void {
    this.gql.patchActive((t) => ({ ...t, queryText: text }));
  }

  onVariablesChange(text: string): void {
    this.gql.patchActive((t) => ({ ...t, variablesText: text }));
  }

  onEnvChange(id: string): void {
    this.ui.setSelectedEnvironmentId(id);
  }

  insertIntrospection(): void {
    this.gql.patchActive((t) => ({
      ...t,
      queryText: INTROSPECTION_MINIMAL,
    }));
  }

  toggleCollection(id: string): void {
    if (this.ui.expandedCollectionId() === id) {
      this.ui.setExpandedCollectionId(null);
      this.expandedRequests.set(null);
      return;
    }
    this.ui.setExpandedCollectionId(id);
    this.api.getCollection(id).subscribe((c) => {
      if (!c) {
        this.expandedRequests.set([]);
        return;
      }
      this.expandedRequests.set(
        c.requests
          .filter((r) => (r.protocol ?? 'REST') === 'GRAPHQL')
          .map((r) => ({
            id: r.id,
            method: r.method,
            url: r.url,
            headers: r.headers,
            params: r.params,
            body: r.body,
            tag: r.tag,
            protocol: r.protocol,
            graphqlVariables: r.graphqlVariables,
            authConfig: r.authConfig,
          })),
      );
    });
  }

  loadStoredRequest(r: {
    id: string;
    method: string;
    url: string;
    headers: unknown;
    params?: unknown;
    body: string | null;
    tag?: string | null;
    protocol?: string;
    graphqlVariables?: unknown;
    authConfig?: unknown;
  }): void {
    const headers: KeyValueRow[] = toHeaderRows(r.headers);
    const vars =
      r.graphqlVariables !== undefined && r.graphqlVariables !== null
        ? JSON.stringify(r.graphqlVariables, null, 2)
        : '{}';
    const tab: GraphqlTabState = {
      id: crypto.randomUUID(),
      title: shortTitle(r.url),
      url: r.url,
      queryText: r.body ?? '',
      variablesText: vars,
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      auth: parseAuthFromUnknown(r.authConfig) ?? defaultAuth(),
    };
    this.gql.loadTabState(tab);
  }

  pickHistory(item: HistoryEntryDto): void {
    if (historyEntryProtocol(item) !== 'GRAPHQL') return;
    const raw = item.request as Record<string, unknown> | null;
    if (!raw) return;
    const url = (raw['url'] as string) || '';
    const query = (raw['query'] as string) || '';
    const variables = raw['variables'];
    const variablesText =
      variables !== undefined && variables !== null
        ? JSON.stringify(variables, null, 2)
        : '{}';
    const headers = toHeaderRows(raw['headers']);
    const authFromHist = normalizeHistoryAuth(
      parseAuthFromUnknown(raw['auth']),
    );
    const tab: GraphqlTabState = {
      id: crypto.randomUUID(),
      title: shortTitle(url),
      url,
      queryText: query,
      variablesText,
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      auth: authFromHist,
    };
    this.gql.loadTabState(tab);
    const res = item.response as Record<string, unknown> | null;
    if (res && typeof res['status'] === 'number') {
      this.response.set({
        success: true,
        status: res['status'] as number,
        duration: item.duration,
        headers: (res['headers'] as Record<string, string>) ?? {},
        data: res['data'],
      });
    }
  }

  newCollection(): void {
    if (typeof window === 'undefined') return;
    const name = window.prompt('Nome da collection');
    if (!name?.trim()) return;
    this.api.createCollection({ name: name.trim() }).subscribe(() =>
      this.refreshMeta(),
    );
  }

  duplicateCollection(id: string): void {
    this.api.duplicateCollection(id).subscribe(() => this.refreshMeta());
  }

  renameCollection(c: CollectionRow): void {
    if (typeof window === 'undefined') return;
    const name = window.prompt('Novo nome da collection', c.name);
    if (!name?.trim()) return;
    this.api
      .updateCollection(c.id, { name: name.trim() })
      .subscribe(() => this.refreshMeta());
  }

  editCollectionAuth(c: CollectionRow): void {
    this.api.getCollection(c.id).subscribe((col) => {
      if (!col || typeof window === 'undefined') return;
      const cur =
        col.authConfig !== undefined && col.authConfig !== null
          ? JSON.stringify(col.authConfig, null, 2)
          : '';
      const next = window.prompt(
        'Auth predefinida da collection (JSON). Vazio para remover.',
        cur,
      );
      if (next === null) return;
      const trimmed = next.trim();
      if (!trimmed) {
        this.api
          .updateCollection(c.id, { authConfig: null })
          .subscribe(() => this.refreshMeta());
        return;
      }
      try {
        const parsed = JSON.parse(trimmed) as RequestAuthConfig;
        this.api
          .updateCollection(c.id, { authConfig: parsed })
          .subscribe(() => this.refreshMeta());
      } catch {
        this.errorMessage.set('JSON de auth inválido.');
      }
    });
  }

  deleteCollection(id: string): void {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Eliminar esta collection e todos os pedidos guardados?')) {
      return;
    }
    this.api.deleteCollection(id).subscribe(() => {
      if (this.ui.expandedCollectionId() === id) {
        this.ui.setExpandedCollectionId(null);
        this.expandedRequests.set(null);
      }
      this.refreshMeta();
    });
  }

  onDeleteStoredRequest(event: {
    collectionId: string;
    requestId: string;
  }): void {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Eliminar este pedido guardado?')) return;
    this.api
      .deleteStoredRequest(event.collectionId, event.requestId)
      .subscribe(() => {
        this.refreshMeta();
        if (this.ui.expandedCollectionId() === event.collectionId) {
          this.api.getCollection(event.collectionId).subscribe((c) => {
            this.expandedRequests.set(
              c?.requests
                .filter((r) => (r.protocol ?? 'REST') === 'GRAPHQL')
                .map((r) => ({
                  id: r.id,
                  method: r.method,
                  url: r.url,
                  headers: r.headers,
                  params: r.params,
                  body: r.body,
                  tag: r.tag,
                  protocol: r.protocol,
                  graphqlVariables: r.graphqlVariables,
                  authConfig: r.authConfig,
                })) ?? [],
            );
          });
        }
      });
  }

  saveToCollection(): void {
    const cid = this.saveCollectionId();
    const tab = this.activeTab();
    if (!cid || !tab) return;
    const headers = rowsToRecord(tab.headerRows);
    let graphqlVariables: Record<string, unknown> = {};
    try {
      const t = tab.variablesText.trim();
      graphqlVariables = t ? (JSON.parse(t) as Record<string, unknown>) : {};
    } catch {
      this.errorMessage.set('Variables: JSON inválido.');
      return;
    }
    this.errorMessage.set(null);
    this.api
      .saveRequestToCollection(cid, {
        method: 'POST',
        url: tab.url,
        headers,
        body: tab.queryText,
        protocol: 'GRAPHQL',
        graphqlVariables,
        authConfig: authPayload(tab.auth),
      })
      .subscribe(() => this.refreshMeta());
  }

  send(): void {
    const tab = this.activeTab();
    if (!tab) return;
    let variables: Record<string, unknown> = {};
    try {
      const t = tab.variablesText.trim();
      variables = t ? (JSON.parse(t) as Record<string, unknown>) : {};
    } catch {
      this.errorMessage.set('Variables: JSON inválido.');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    this.response.set(null);
    const headers = rowsToRecord(tab.headerRows);
    const envId = this.ui.selectedEnvironmentId().trim();
    this.api
      .executeGraphql({
        url: tab.url,
        query: tab.queryText,
        variables,
        headers,
        environmentId: envId || undefined,
        auth: authPayload(tab.auth),
      })
      .subscribe({
        next: (r) => {
          this.response.set(r);
          this.loading.set(false);
          this.refreshMeta();
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          const e = err.error as { error?: { message?: string } } | string;
          const msg =
            typeof e === 'string'
              ? e
              : (e?.error as { message?: string })?.message ??
                JSON.stringify(err.error ?? err.message);
          this.errorMessage.set(msg);
        },
      });
  }
}

function shortTitle(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname;
  } catch {
    return url.slice(0, 32) || 'Untitled';
  }
}

function rowsToRecord(rows: KeyValueRow[]): Record<string, string> {
  const o: Record<string, string> = {};
  for (const r of rows) {
    if (r.key.trim()) o[r.key.trim()] = r.value;
  }
  return o;
}

function toHeaderRows(headers: unknown): KeyValueRow[] {
  if (!headers || typeof headers !== 'object') return [];
  return Object.entries(headers as Record<string, string>).map(
    ([key, value]) => ({
      key,
      value: String(value),
    }),
  );
}
