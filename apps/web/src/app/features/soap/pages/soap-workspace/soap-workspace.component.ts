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
  type KeyValueRow,
  type RequestAuthConfig,
  type RestExecuteResponse,
} from '../../../requests/models/workspace.models';
import { AuthorizationEditorComponent } from '../../../requests/components/authorization-editor/authorization-editor.component';
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
import { tryFormatXml } from '../../../../core/utils/format-xml';
import { XmlEditorComponent } from '../../components/xml-editor/xml-editor.component';
import type { SoapTabState } from '../../models/soap-workspace.models';
import { SoapWorkspacePersistenceService } from '../../services/soap-workspace-persistence.service';
import {
  authPayload,
  normalizeHistoryAuth,
  parseAuthFromUnknown,
} from '../../../requests/utils/request-auth.utils';

@Component({
  selector: 'app-soap-workspace-page',
  standalone: true,
  imports: [
    RequestTabsComponent,
    KeyValueTableComponent,
    AuthorizationEditorComponent,
    ResponseViewerComponent,
    WorkspaceSidebarComponent,
    EnvironmentEditorModalComponent,
    XmlEditorComponent,
  ],
  templateUrl: './soap-workspace.component.html',
})
export class SoapWorkspacePageComponent {
  private readonly api = inject(RestWorkspaceApiService);
  readonly ui = inject(WorkspacePersistenceService);
  readonly soap = inject(SoapWorkspacePersistenceService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly loading = signal(false);
  readonly response = signal<RestExecuteResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly responseXmlPretty = signal(false);

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
      this.soap
        .tabs()
        .find((t) => t.id === this.soap.activeTabId()) ?? null,
  );

  readonly soapFaultHint = computed(() => {
    const d = this.response()?.data;
    if (typeof d !== 'string' || !d.trim()) return null;
    if (!/<[^>]*Fault\b/i.test(d)) return null;
    return 'Resposta contém elemento Fault — rever XML abaixo.';
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
      if (historyEntryProtocol(entry) !== 'SOAP') return;
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
    if (p === 'GRAPHQL') {
      storePendingHistoryReplay(entry);
      void this.router.navigate(['/app/graphql']);
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
    this.soap.setActiveTab(id);
  }

  onCloseTab(id: string): void {
    this.soap.closeTab(id);
  }

  addTab(): void {
    this.soap.addTab();
  }

  updateUrl(url: string): void {
    this.soap.patchActive((t) => ({ ...t, url, title: shortTitle(url) }));
  }

  onHeadersChange(rows: KeyValueRow[]): void {
    this.soap.patchActive((t) => ({ ...t, headerRows: rows }));
  }

  onAuthChange(auth: RequestAuthConfig): void {
    this.soap.patchActive((t) => ({ ...t, auth }));
  }

  onXmlChange(text: string): void {
    this.soap.patchActive((t) => ({ ...t, xmlText: text }));
  }

  onEnvChange(id: string): void {
    this.ui.setSelectedEnvironmentId(id);
  }

  formatEnvelope(): void {
    const tab = this.activeTab();
    if (!tab) return;
    const next = tryFormatXml(tab.xmlText);
    this.soap.patchActive((t) => ({ ...t, xmlText: next }));
  }

  toggleResponsePretty(): void {
    this.responseXmlPretty.update((v) => !v);
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
          .filter((r) => (r.protocol ?? 'REST') === 'SOAP')
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
    const tab: SoapTabState = {
      id: crypto.randomUUID(),
      title: shortTitle(r.url),
      url: r.url,
      xmlText: r.body ?? '',
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      auth: parseAuthFromUnknown(r.authConfig) ?? defaultAuth(),
    };
    this.soap.loadTabState(tab);
  }

  pickHistory(item: HistoryEntryDto): void {
    if (historyEntryProtocol(item) !== 'SOAP') return;
    const raw = item.request as Record<string, unknown> | null;
    if (!raw) return;
    const url = (raw['url'] as string) || '';
    const xml = (raw['xml'] as string) || '';
    const headers = toHeaderRows(raw['headers']);
    const authFromHist = normalizeHistoryAuth(
      parseAuthFromUnknown(raw['auth']),
    );
    const tab: SoapTabState = {
      id: crypto.randomUUID(),
      title: shortTitle(url),
      url,
      xmlText: xml,
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      auth: authFromHist,
    };
    this.soap.loadTabState(tab);
    this.responseXmlPretty.set(false);
    const res = item.response as Record<string, unknown> | null;
    if (res && typeof res['status'] === 'number') {
      const responseData = res['data'];
      this.response.set({
        success: true,
        status: res['status'] as number,
        duration: item.duration,
        headers: (res['headers'] as Record<string, string>) ?? {},
        data:
          typeof responseData === 'string'
            ? responseData
            : responseData !== undefined && responseData !== null
              ? String(responseData)
              : '',
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
                .filter((r) => (r.protocol ?? 'REST') === 'SOAP')
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
    if (!tab.xmlText.trim()) {
      this.errorMessage.set('Envelope XML vazio.');
      return;
    }
    this.errorMessage.set(null);
    this.api
      .saveRequestToCollection(cid, {
        method: 'POST',
        url: tab.url,
        headers,
        body: tab.xmlText,
        protocol: 'SOAP',
        authConfig: authPayload(tab.auth),
      })
      .subscribe(() => this.refreshMeta());
  }

  send(): void {
    const tab = this.activeTab();
    if (!tab) return;
    if (!tab.xmlText.trim()) {
      this.errorMessage.set('Envelope XML vazio.');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    this.response.set(null);
    this.responseXmlPretty.set(false);
    const headers = rowsToRecord(tab.headerRows);
    const envId = this.ui.selectedEnvironmentId().trim();
    this.api
      .executeSoap({
        url: tab.url,
        xml: tab.xmlText,
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
