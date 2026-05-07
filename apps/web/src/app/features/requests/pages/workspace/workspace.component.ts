import { isPlatformBrowser } from '@angular/common';
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
  type HttpMethod,
  type KeyValueRow,
  type RequestAuthConfig,
  type RestExecuteResponse,
  type WorkspaceTabState,
} from '../../models/workspace.models';
import { AuthorizationEditorComponent } from '../../components/authorization-editor/authorization-editor.component';
import { BodyEditorComponent } from '../../components/body-editor/body-editor.component';
import { KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';
import { RequestTabsComponent } from '../../components/request-tabs/request-tabs.component';
import { ResponseViewerComponent } from '../../components/response-viewer/response-viewer.component';
import {
  WorkspaceSidebarComponent,
} from '../../components/workspace-sidebar/workspace-sidebar.component';
import { EnvironmentEditorModalComponent } from '../../../environments/components/environment-editor-modal/environment-editor-modal.component';
import { OpenApiImportModalComponent } from '../../../openapi/components/openapi-import-modal/openapi-import-modal.component';
import {
  RestWorkspaceApiService,
  type CollectionRow,
  type HistoryEntryDto,
  type ImportOpenApiResult,
} from '../../services/rest-workspace-api.service';
import { WorkspacePersistenceService } from '../../services/workspace-persistence.service';
import {
  authPayload,
  normalizeHistoryAuth,
  parseAuthFromUnknown,
} from '../../utils/request-auth.utils';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [
    RequestTabsComponent,
    KeyValueTableComponent,
    AuthorizationEditorComponent,
    BodyEditorComponent,
    ResponseViewerComponent,
    WorkspaceSidebarComponent,
    EnvironmentEditorModalComponent,
    OpenApiImportModalComponent,
  ],
  templateUrl: './workspace.component.html',
})
export class WorkspacePageComponent {
  private readonly api = inject(RestWorkspaceApiService);
  readonly store = inject(WorkspacePersistenceService);
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
  readonly openApiModalOpen = signal(false);

  readonly activeTab = computed(
    () =>
      this.store
        .tabs()
        .find((t) => t.id === this.store.activeTabId()) ?? null,
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshMeta();
    }
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const pending = peekPendingHistoryReplay();
      if (!pending || typeof pending !== 'object') return;
      const entry = pending as HistoryEntryDto;
      if (historyEntryProtocol(entry) !== 'REST') return;
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
    if (p === 'GRAPHQL') {
      storePendingHistoryReplay(entry);
      void this.router.navigate(['/app/graphql']);
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

  openOpenApiImport(): void {
    this.openApiModalOpen.set(true);
  }

  onOpenApiImported(result: ImportOpenApiResult): void {
    this.refreshMeta();
    this.store.setSelectedEnvironmentId(result.environmentId);
  }

  onSelectTab(id: string): void {
    this.store.setActiveTab(id);
  }

  onCloseTab(id: string): void {
    this.store.closeTab(id);
  }

  addTab(): void {
    this.store.addTab();
  }

  updateMethod(m: string): void {
    this.store.patchActive((t) => ({
      ...t,
      method: m as HttpMethod,
    }));
  }

  updateUrl(url: string): void {
    this.store.patchActive((t) => ({ ...t, url, title: shortTitle(url) }));
  }

  onHeadersChange(rows: KeyValueRow[]): void {
    this.store.patchActive((t) => ({ ...t, headerRows: rows }));
  }

  onParamsChange(rows: KeyValueRow[]): void {
    this.store.patchActive((t) => ({ ...t, paramRows: rows }));
  }

  onBodyChange(text: string): void {
    this.store.patchActive((t) => ({ ...t, bodyText: text }));
  }

  onAuthChange(auth: RequestAuthConfig): void {
    this.store.patchActive((t) => ({ ...t, auth }));
  }

  onEnvChange(id: string): void {
    this.store.setSelectedEnvironmentId(id);
  }

  toggleCollection(id: string): void {
    if (this.store.expandedCollectionId() === id) {
      this.store.setExpandedCollectionId(null);
      this.expandedRequests.set(null);
      return;
    }
    this.store.setExpandedCollectionId(id);
    this.api.getCollection(id).subscribe((c) => {
      if (!c) {
        this.expandedRequests.set([]);
        return;
      }
      this.expandedRequests.set(
        c.requests
          .filter((r) => {
            const p = r.protocol ?? 'REST';
            return p !== 'GRAPHQL' && p !== 'SOAP';
          })
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
    protocol?: string;
    graphqlVariables?: unknown;
    authConfig?: unknown;
  }): void {
    const headers: KeyValueRow[] = toHeaderRows(r.headers);
    const paramRows = paramsToRows(r.params);
    const tab: WorkspaceTabState = {
      id: crypto.randomUUID(),
      title: shortTitle(r.url),
      method: r.method as HttpMethod,
      url: r.url,
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      paramRows,
      bodyText: r.body ?? '',
      auth: parseAuthFromUnknown(r.authConfig) ?? defaultAuth(),
    };
    this.store.loadTabState(tab);
  }

  pickHistory(item: HistoryEntryDto): void {
    const raw = item.request as Record<string, unknown> | null;
    if (!raw) return;
    if (raw['protocol'] === 'GRAPHQL' || raw['protocol'] === 'SOAP') return;
    const method = (raw['method'] as string) || 'GET';
    const url = (raw['url'] as string) || '';
    const headers = toHeaderRows(raw['headers']);
    const paramsObj = raw['params'] as Record<string, string> | undefined;
    const paramRows: KeyValueRow[] = paramsObj
      ? Object.entries(paramsObj).map(([key, value]) => ({ key, value }))
      : [];
    const body =
      raw['body'] !== undefined && raw['body'] !== null
        ? typeof raw['body'] === 'string'
          ? raw['body']
          : JSON.stringify(raw['body'], null, 2)
        : '';
    const authFromHist = normalizeHistoryAuth(
      parseAuthFromUnknown(raw['auth']),
    );
    const tab: WorkspaceTabState = {
      id: crypto.randomUUID(),
      title: shortTitle(url),
      method: method as HttpMethod,
      url,
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      paramRows,
      bodyText: body,
      auth: authFromHist,
    };
    this.store.loadTabState(tab);
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
      if (this.store.expandedCollectionId() === id) {
        this.store.setExpandedCollectionId(null);
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
        if (this.store.expandedCollectionId() === event.collectionId) {
          this.api.getCollection(event.collectionId).subscribe((c) => {
            this.expandedRequests.set(
              c?.requests
                .filter((r) => {
                  const p = r.protocol ?? 'REST';
                  return p !== 'GRAPHQL' && p !== 'SOAP';
                })
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
    const params = rowsToRecord(tab.paramRows);
    this.api
      .saveRequestToCollection(cid, {
        method: tab.method,
        url: tab.url,
        headers,
        params: Object.keys(params).length ? params : undefined,
        body: tab.bodyText?.trim() ? tab.bodyText : null,
        authConfig: authPayload(tab.auth),
      })
      .subscribe(() => this.refreshMeta());
  }

  send(): void {
    const tab = this.activeTab();
    if (!tab) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.response.set(null);
    const headers = rowsToRecord(tab.headerRows);
    const params = rowsToRecord(tab.paramRows);
    const body = buildBody(tab.bodyText, tab.method);
    const envId = this.store.selectedEnvironmentId().trim();
    this.api
      .executeRequest({
        method: tab.method,
        url: tab.url,
        headers,
        params: Object.keys(params).length ? params : undefined,
        body,
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

function paramsToRows(params: unknown): KeyValueRow[] {
  if (!params || typeof params !== 'object') {
    return [{ key: '', value: '' }];
  }
  const entries = Object.entries(params as Record<string, unknown>).filter(
    ([k]) => k.trim().length > 0,
  );
  if (!entries.length) return [{ key: '', value: '' }];
  return entries.map(([key, value]) => ({
    key,
    value: String(value),
  }));
}

function buildBody(text: string, method: string): unknown | undefined {
  if (method === 'GET' || method === 'HEAD') return undefined;
  const t = text.trim();
  if (!t) return undefined;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return t;
  }
}
