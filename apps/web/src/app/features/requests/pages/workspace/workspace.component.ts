import { isPlatformBrowser, NgClass } from '@angular/common';
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
  type StoredRequestDto,
} from '../../services/rest-workspace-api.service';
import { WorkspaceAppHeaderComponent } from '../../../../shared/components/workspace-app-header/workspace-app-header.component';
import {
  ConfirmDialogComponent,
  type ConfirmDialogTone,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from '../../../../shared/components/prompt-dialog/prompt-dialog.component';
import { WorkspacePersistenceService } from '../../services/workspace-persistence.service';
import {
  authPayload,
  normalizeHistoryAuth,
  parseAuthFromUnknown,
} from '../../utils/request-auth.utils';
import {
  tryParseCurlCommand,
  type ParsedCurlRequest,
} from '../../utils/parse-curl.utils';
import { ROOT_STORED_REQUESTS_FOLDER_ID } from '../../constants/workspace.constants';
import {
  isWorkspaceTabDirty,
  workspaceTabContentFingerprint,
} from '../../utils/workspace-tab.utils';
import { methodTone } from '../../utils/http-method.utils';

export type RestRequestSection =
  | 'params'
  | 'authorization'
  | 'headers'
  | 'body';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [
    NgClass,
    RequestTabsComponent,
    KeyValueTableComponent,
    AuthorizationEditorComponent,
    BodyEditorComponent,
    ResponseViewerComponent,
    WorkspaceSidebarComponent,
    WorkspaceAppHeaderComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
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

  readonly rootFolderId = ROOT_STORED_REQUESTS_FOLDER_ID;

  /** Helper para o template pintar a pill de método. */
  protected readonly methodTone = methodTone;

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

  readonly saveModalOpen = signal(false);
  /** Destino no modal Save: raiz ou collection. */
  readonly saveModalDestination = signal<'root' | 'collection'>('root');
  readonly saveModalCollectionId = signal('');
  readonly saveModalRequestName = signal('');
  /** Se não-null, Save aplica a esta aba (ex.: fechar aba com guardar). */
  readonly saveModalContextTabId = signal<string | null>(null);

  readonly closeTabPromptOpen = signal(false);
  readonly pendingCloseTabId = signal<string | null>(null);

  /** Configuração do modal genérico de confirmação. */
  readonly confirmConfig = signal<{
    title: string;
    message: string | null;
    confirmLabel: string;
    cancelLabel: string;
    tone: ConfirmDialogTone;
    onConfirm: () => void;
  } | null>(null);

  /** Modal de texto (substitui `window.prompt`). */
  readonly promptConfig = signal<{
    title: string;
    message: string | null;
    label: string;
    placeholder: string;
    initialValue: string;
    maxlength: number;
    confirmLabel: string;
    cancelLabel: string;
    requireNonEmpty: boolean;
    onConfirm: (value: string) => void;
  } | null>(null);

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

  /** Visão das abas para o componente de request-tabs (inclui dirty + método). */
  readonly tabsForView = computed(() =>
    this.store.tabs().map((t) => ({
      id: t.id,
      title: t.title,
      method: t.method,
      protocol: 'REST' as const,
      dirty: isWorkspaceTabDirty(t),
    })),
  );

  /** Postman-style sub-tabs: Params / Authorization / Headers / Body */
  readonly restRequestSection = signal<RestRequestSection>('params');
  readonly restRequestSections: ReadonlyArray<{
    id: RestRequestSection;
    label: string;
  }> = [
    { id: 'params', label: 'Params' },
    { id: 'authorization', label: 'Authorization' },
    { id: 'headers', label: 'Headers' },
    { id: 'body', label: 'Body' },
  ];

  /** Painel de resposta só após Send ou quando existir erro de execução. */
  readonly showResponsePanel = computed(
    () =>
      this.response() !== null ||
      (this.errorMessage()?.trim().length ?? 0) > 0,
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
    this.reloadExpandedRequestsList();
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
    const tab = this.store.tabs().find((t) => t.id === id);
    if (!tab) return;
    if (!isWorkspaceTabDirty(tab)) {
      this.store.closeTab(id);
      return;
    }
    this.pendingCloseTabId.set(id);
    this.closeTabPromptOpen.set(true);
  }

  closeTabPromptDiscard(): void {
    const id = this.pendingCloseTabId();
    this.closeTabPromptOpen.set(false);
    this.pendingCloseTabId.set(null);
    if (id) this.store.closeTab(id);
  }

  closeTabPromptCancel(): void {
    this.closeTabPromptOpen.set(false);
    this.pendingCloseTabId.set(null);
  }

  closeTabPromptSave(): void {
    const id = this.pendingCloseTabId();
    if (!id) return;
    const tab = this.store.tabs().find((t) => t.id === id);
    if (!tab) return;
    this.closeTabPromptOpen.set(false);
    if (tab.linkedStored) {
      this.persistLinkedTabAndClose(id, tab);
      return;
    }
    this.saveModalContextTabId.set(id);
    this.store.setActiveTab(id);
    this.openSaveModal({ preserveContext: true });
  }

  private persistLinkedTabAndClose(tabId: string, tab: WorkspaceTabState): void {
    const link = tab.linkedStored;
    if (!link) return;
    const headersRaw = rowsToRecord(tab.headerRows);
    const headers =
      Object.keys(headersRaw).length === 0
        ? { Accept: 'application/json' }
        : headersRaw;
    const params = rowsToRecord(tab.paramRows);
    const patch = {
      method: tab.method,
      url: tab.url,
      headers,
      body: tab.bodyText?.trim() ? tab.bodyText : null,
      authConfig: authPayload(tab.auth),
      tag: tab.title.trim() || shortTitle(tab.url),
      ...(Object.keys(params).length ? { params } : {}),
    };
    const req$ =
      link.collectionId === null
        ? this.api.updateRootStoredRequest(link.requestId, patch)
        : this.api.updateStoredRequest(
            link.collectionId,
            link.requestId,
            patch,
          );
    req$.subscribe({
      next: () => {
        this.pendingCloseTabId.set(null);
        this.store.closeTab(tabId);
        this.refreshMeta();
      },
      error: (err: HttpErrorResponse) => this.setHttpErrorMessage(err),
    });
  }

  private finalizeSaveModalSuccess(
    created: StoredRequestDto | undefined,
    tabId: string,
    tab: WorkspaceTabState,
    linked: { collectionId: string | null },
    displayName: string,
  ): void {
    if (!created?.id) {
      this.errorMessage.set('Save failed: invalid server response.');
      return;
    }
    this.errorMessage.set(null);
    this.saveModalOpen.set(false);
    const closingId = this.pendingCloseTabId();
    const fp = workspaceTabContentFingerprint(tab);
    const title = displayName.slice(0, 200);
    if (closingId === tabId) {
      this.pendingCloseTabId.set(null);
      this.saveModalContextTabId.set(null);
      this.store.closeTab(tabId);
    } else {
      this.store.patchTab(tabId, (t) => ({
        ...t,
        linkedStored: {
          requestId: created.id,
          collectionId: linked.collectionId,
        },
        savedFingerprint: fp,
        title,
      }));
      this.saveModalContextTabId.set(null);
    }
    this.refreshMeta();
  }

  private setHttpErrorMessage(err: HttpErrorResponse): void {
    const e = err.error as
      | { error?: { message?: string }; message?: string }
      | string
      | null
      | undefined;
    const msg =
      typeof e === 'string'
        ? e
        : (e as { error?: { message?: string } })?.error?.message ??
          (e as { message?: string })?.message ??
          err.message ??
          'Request failed.';
    this.errorMessage.set(msg);
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

  onUrlPaste(event: ClipboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const text = event.clipboardData?.getData('text/plain') ?? '';
    const trimmed = text.trim();
    if (!trimmed || !/^curl(\s|$)/i.test(trimmed)) return;
    const parsed = tryParseCurlCommand(trimmed);
    if (!parsed) return;
    event.preventDefault();
    event.stopPropagation();
    this.errorMessage.set(null);
    this.applyParsedCurl(parsed);
    this.focusRestSectionAfterCurl(parsed);
  }

  importCurlFromPrompt(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') {
      return;
    }
    const raw = window.prompt('Paste a cURL command');
    if (raw == null || !raw.trim()) return;
    const parsed = tryParseCurlCommand(raw.trim());
    if (!parsed) {
      this.errorMessage.set(
        'Could not parse cURL. Check the command and try again.',
      );
      return;
    }
    this.errorMessage.set(null);
    this.applyParsedCurl(parsed);
    this.focusRestSectionAfterCurl(parsed);
  }

  private applyParsedCurl(parsed: ParsedCurlRequest): void {
    this.store.patchActive((t) => ({
      ...t,
      method: parsed.method,
      url: parsed.url,
      title: shortTitle(parsed.url),
      headerRows: parsed.headerRows,
      paramRows: parsed.queryParams,
      bodyText: parsed.bodyText,
      auth: parsed.auth,
      linkedStored: undefined,
    }));
  }

  private focusRestSectionAfterCurl(parsed: ParsedCurlRequest): void {
    if (parsed.bodyText.trim()) {
      this.restRequestSection.set('body');
      return;
    }
    if (parsed.auth.type !== 'none') {
      this.restRequestSection.set('authorization');
      return;
    }
    if (parsed.headerRows.some((h) => h.key.trim())) {
      this.restRequestSection.set('headers');
      return;
    }
    this.restRequestSection.set('params');
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
    if (id === ROOT_STORED_REQUESTS_FOLDER_ID) {
      this.api.listRootStoredRequests().subscribe((rows) => {
        this.expandedRequests.set(mapRestRequestsForSidebar(rows));
      });
      return;
    }
    this.api.getCollection(id).subscribe((c) => {
      if (!c) {
        this.expandedRequests.set([]);
        return;
      }
      this.expandedRequests.set(mapRestRequestsForSidebar(c.requests));
    });
  }

  private reloadExpandedRequestsList(): void {
    const exp = this.store.expandedCollectionId();
    if (!exp) return;
    if (exp === ROOT_STORED_REQUESTS_FOLDER_ID) {
      this.api.listRootStoredRequests().subscribe((rows) => {
        this.expandedRequests.set(mapRestRequestsForSidebar(rows));
      });
      return;
    }
    this.api.getCollection(exp).subscribe((c) => {
      if (!c) {
        this.store.setExpandedCollectionId(null);
        this.expandedRequests.set([]);
        return;
      }
      this.expandedRequests.set(mapRestRequestsForSidebar(c.requests));
    });
  }

  openSaveModal(options?: { preserveContext?: boolean }): void {
    if (!options?.preserveContext) {
      this.saveModalContextTabId.set(null);
    }
    const tabId = this.saveModalContextTabId() ?? this.store.activeTabId();
    const tab = this.store.tabs().find((t) => t.id === tabId);
    const label =
      tab?.title?.trim() ||
      (tab?.url ? shortTitle(tab.url) : '') ||
      'Untitled';
    this.saveModalRequestName.set(label.slice(0, 200));
    this.errorMessage.set(null);
    this.saveModalOpen.set(true);
    this.saveModalDestination.set('root');
    this.saveModalCollectionId.set('');
  }

  closeSaveModal(): void {
    this.saveModalOpen.set(false);
    this.saveModalContextTabId.set(null);
    this.pendingCloseTabId.set(null);
  }

  setSaveModalDestination(dest: 'root' | 'collection'): void {
    this.saveModalDestination.set(dest);
  }

  confirmSaveFromModal(): void {
    const contextId =
      this.saveModalContextTabId() ?? this.store.activeTabId();
    const tab = this.store.tabs().find((t) => t.id === contextId);
    if (!tab) return;

    const nameRaw = this.saveModalRequestName().trim();
    if (!nameRaw) {
      this.errorMessage.set('Enter a request name.');
      return;
    }
    const displayName = nameRaw.slice(0, 200);

    if (
      this.saveModalDestination() === 'collection' &&
      !this.saveModalCollectionId().trim()
    ) {
      this.errorMessage.set('Select a collection.');
      return;
    }

    this.errorMessage.set(null);

    const headersRaw = rowsToRecord(tab.headerRows);
    const headers =
      Object.keys(headersRaw).length === 0
        ? { Accept: 'application/json' }
        : headersRaw;
    const params = rowsToRecord(tab.paramRows);
    const payload = {
      method: tab.method,
      url: tab.url,
      headers,
      params: Object.keys(params).length ? params : undefined,
      body: tab.bodyText?.trim() ? tab.bodyText : null,
      authConfig: authPayload(tab.auth),
      tag: displayName,
    };

    if (this.saveModalDestination() === 'root') {
      this.api.saveRequestToRoot(payload).subscribe({
        next: (created) => {
          this.store.setExpandedCollectionId(ROOT_STORED_REQUESTS_FOLDER_ID);
          this.finalizeSaveModalSuccess(created, contextId, tab, {
            collectionId: null,
          }, displayName);
        },
        error: (err: HttpErrorResponse) => this.setHttpErrorMessage(err),
      });
      return;
    }
    const cid = this.saveModalCollectionId().trim();
    this.api.saveRequestToCollection(cid, payload).subscribe({
      next: (created) => {
        this.finalizeSaveModalSuccess(created, contextId, tab, {
          collectionId: cid,
        }, displayName);
      },
      error: (err: HttpErrorResponse) => this.setHttpErrorMessage(err),
    });
  }

  loadStoredRequest(event: {
    storageFolderId: string;
    request: {
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
    };
  }): void {
    const r = event.request;
    const collectionId =
      event.storageFolderId === ROOT_STORED_REQUESTS_FOLDER_ID
        ? null
        : event.storageFolderId;

    const alreadyOpen = this.store
      .tabs()
      .find(
        (t) =>
          t.linkedStored?.requestId === r.id &&
          (t.linkedStored?.collectionId ?? null) === collectionId,
      );
    if (alreadyOpen) {
      this.store.setActiveTab(alreadyOpen.id);
      return;
    }

    const headers: KeyValueRow[] = toHeaderRows(r.headers);
    const paramRows = paramsToRows(r.params);
    const tab: WorkspaceTabState = {
      id: crypto.randomUUID(),
      title: (r.tag?.trim() || shortTitle(r.url)).slice(0, 200),
      method: r.method as HttpMethod,
      url: r.url,
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      paramRows,
      bodyText: r.body ?? '',
      auth: parseAuthFromUnknown(r.authConfig) ?? defaultAuth(),
      linkedStored: { requestId: r.id, collectionId },
      savedFingerprint: '',
    };
    tab.savedFingerprint = workspaceTabContentFingerprint(tab);
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
      savedFingerprint: '',
    };
    tab.savedFingerprint = workspaceTabContentFingerprint(tab);
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
    this.askPrompt({
      title: 'New collection',
      label: 'Collection name',
      placeholder: 'My collection',
      initialValue: '',
      maxlength: 120,
      onConfirm: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        this.api.createCollection({ name: trimmed }).subscribe(() =>
          this.refreshMeta(),
        );
      },
    });
  }

  duplicateCollection(id: string): void {
    this.api.duplicateCollection(id).subscribe(() => this.refreshMeta());
  }

  renameCollection(c: CollectionRow): void {
    this.askPrompt({
      title: 'Rename collection',
      label: 'Collection name',
      initialValue: c.name,
      maxlength: 120,
      onConfirm: (name) => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === c.name) return;
        this.api
          .updateCollection(c.id, { name: trimmed })
          .subscribe(() => this.refreshMeta());
      },
    });
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
        this.errorMessage.set('Invalid auth JSON.');
      }
    });
  }

  deleteCollection(id: string): void {
    const collection = this.collections().find((c) => c.id === id);
    const name = collection?.name?.trim() || 'this collection';
    this.askConfirm({
      title: 'Delete collection',
      message: `Delete "${name}" and all saved requests inside it? This action cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: () => {
        this.api.deleteCollection(id).subscribe(() => {
          if (this.store.expandedCollectionId() === id) {
            this.store.setExpandedCollectionId(null);
            this.expandedRequests.set(null);
          }
          this.refreshMeta();
        });
      },
    });
  }

  onDeleteStoredRequest(event: {
    collectionId: string;
    requestId: string;
  }): void {
    const stored = this.expandedRequests()?.find((r) => r.id === event.requestId);
    const label =
      stored?.tag?.trim() || (stored?.url ? shortTitle(stored.url) : 'this request');
    this.askConfirm({
      title: 'Delete saved request',
      message: `Delete "${label}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: () => {
        const del$ =
          event.collectionId === ROOT_STORED_REQUESTS_FOLDER_ID
            ? this.api.deleteRootStoredRequest(event.requestId)
            : this.api.deleteStoredRequest(event.collectionId, event.requestId);
        del$.subscribe(() => this.refreshMeta());
      },
    });
  }

  askConfirm(config: {
    title: string;
    message?: string | null;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmDialogTone;
    onConfirm: () => void;
  }): void {
    this.confirmConfig.set({
      title: config.title,
      message: config.message ?? null,
      confirmLabel: config.confirmLabel ?? 'Confirm',
      cancelLabel: config.cancelLabel ?? 'Cancel',
      tone: config.tone ?? 'primary',
      onConfirm: config.onConfirm,
    });
  }

  askPrompt(config: {
    title: string;
    message?: string | null;
    label?: string;
    placeholder?: string;
    initialValue: string;
    maxlength?: number;
    confirmLabel?: string;
    cancelLabel?: string;
    requireNonEmpty?: boolean;
    onConfirm: (value: string) => void;
  }): void {
    this.promptConfig.set({
      title: config.title,
      message: config.message ?? null,
      label: config.label ?? 'Name',
      placeholder: config.placeholder ?? '',
      initialValue: config.initialValue,
      maxlength: config.maxlength ?? 200,
      confirmLabel: config.confirmLabel ?? 'Save',
      cancelLabel: config.cancelLabel ?? 'Cancel',
      requireNonEmpty: config.requireNonEmpty ?? true,
      onConfirm: config.onConfirm,
    });
  }

  onPromptDialogConfirmed(value: string): void {
    const cfg = this.promptConfig();
    this.promptConfig.set(null);
    cfg?.onConfirm(value);
  }

  onPromptDialogCancelled(): void {
    this.promptConfig.set(null);
  }

  onConfirmDialogAccepted(): void {
    const cfg = this.confirmConfig();
    this.confirmConfig.set(null);
    cfg?.onConfirm();
  }

  onConfirmDialogCancelled(): void {
    this.confirmConfig.set(null);
  }

  onRenameStoredRequest(event: {
    collectionId: string;
    requestId: string;
    currentTag: string | null | undefined;
    currentUrl: string;
  }): void {
    const current =
      (event.currentTag ?? '').trim() || shortTitle(event.currentUrl);
    this.askPrompt({
      title: 'Rename request',
      label: 'Request name',
      placeholder: 'My API call',
      initialValue: current,
      maxlength: 200,
      onConfirm: (next) => {
        const trimmed = next.trim();
        if (!trimmed || trimmed === current) return;
        const linkCollectionId =
          event.collectionId === ROOT_STORED_REQUESTS_FOLDER_ID
            ? null
            : event.collectionId;
        const update$ =
          linkCollectionId === null
            ? this.api.updateRootStoredRequest(event.requestId, {
                tag: trimmed,
              })
            : this.api.updateStoredRequest(linkCollectionId, event.requestId, {
                tag: trimmed,
              });
        update$.subscribe({
          next: () => {
            this.syncOpenTabsTitle(event.requestId, linkCollectionId, trimmed);
            this.refreshMeta();
          },
          error: (err: HttpErrorResponse) => this.setHttpErrorMessage(err),
        });
      },
    });
  }

  onTabDuplicated(id: string): void {
    const tab = this.store.tabs().find((t) => t.id === id);
    if (!tab) return;
    const clone: WorkspaceTabState = {
      ...tab,
      id: crypto.randomUUID(),
      title: this.duplicateTitle(tab.title),
      headerRows: tab.headerRows.map((r) => ({ ...r })),
      paramRows: tab.paramRows.map((r) => ({ ...r })),
      auth: { ...tab.auth },
      linkedStored: undefined,
      savedFingerprint: '',
    };
    clone.savedFingerprint = workspaceTabContentFingerprint(clone);
    this.store.loadTabState(clone);
  }

  onCloseOtherTabs(keepId: string): void {
    const others = this.store.tabs().filter((t) => t.id !== keepId);
    if (!others.length) return;
    const closeAction = () => {
      for (const t of others) this.store.closeTab(t.id);
    };
    if (others.some((t) => isWorkspaceTabDirty(t))) {
      this.askConfirm({
        title: 'Close other tabs',
        message:
          'Some of the other tabs have unsaved changes. Close them anyway?',
        confirmLabel: 'Close tabs',
        tone: 'warning',
        onConfirm: closeAction,
      });
      return;
    }
    closeAction();
  }

  onCloseTabsToRight(pivotId: string): void {
    const list = this.store.tabs();
    const idx = list.findIndex((t) => t.id === pivotId);
    if (idx < 0) return;
    const toClose = list.slice(idx + 1);
    if (!toClose.length) return;
    const closeAction = () => {
      for (const t of toClose) this.store.closeTab(t.id);
    };
    if (toClose.some((t) => isWorkspaceTabDirty(t))) {
      this.askConfirm({
        title: 'Close tabs to the right',
        message:
          'Some tabs to the right have unsaved changes. Close them anyway?',
        confirmLabel: 'Close tabs',
        tone: 'warning',
        onConfirm: closeAction,
      });
      return;
    }
    closeAction();
  }

  onCloseAllTabs(): void {
    const list = this.store.tabs();
    if (!list.length) return;
    const closeAction = () => this.store.resetTabsToBlank();
    if (list.some((t) => isWorkspaceTabDirty(t))) {
      this.askConfirm({
        title: 'Close all tabs',
        message: 'Some tabs have unsaved changes. Close all anyway?',
        confirmLabel: 'Close all',
        tone: 'warning',
        onConfirm: closeAction,
      });
      return;
    }
    closeAction();
  }

  private duplicateTitle(title: string): string {
    const base = title.replace(/\s+\(copy(?:\s+\d+)?\)$/i, '');
    return `${base} (copy)`.slice(0, 200);
  }

  onTabRenamed(event: { id: string; title: string }): void {
    const trimmed = event.title.trim();
    if (!trimmed) return;
    const tab = this.store.tabs().find((t) => t.id === event.id);
    if (!tab) return;
    const title = trimmed.slice(0, 200);
    this.store.patchTab(event.id, (t) => ({ ...t, title }));
    const link = tab.linkedStored;
    if (!link) return;
    const update$ =
      link.collectionId === null
        ? this.api.updateRootStoredRequest(link.requestId, { tag: title })
        : this.api.updateStoredRequest(link.collectionId, link.requestId, {
            tag: title,
          });
    update$.subscribe({
      next: () => this.refreshMeta(),
      error: (err: HttpErrorResponse) => this.setHttpErrorMessage(err),
    });
  }

  private syncOpenTabsTitle(
    requestId: string,
    collectionId: string | null,
    title: string,
  ): void {
    const next = title.slice(0, 200);
    for (const t of this.store.tabs()) {
      const link = t.linkedStored;
      if (
        link &&
        link.requestId === requestId &&
        (link.collectionId ?? null) === collectionId
      ) {
        this.store.patchTab(t.id, (cur) => ({ ...cur, title: next }));
      }
    }
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

type SidebarStoredRow = {
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
};

function mapRestRequestsForSidebar(
  list: SidebarStoredRow[],
): {
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
}[] {
  return list
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
    }));
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
