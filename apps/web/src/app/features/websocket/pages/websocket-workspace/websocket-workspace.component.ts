import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { storePendingHistoryReplay } from '../../../../core/constants/pending-history-replay.storage';
import { historyEntryProtocol } from '../../../history/utils/history-entry-protocol';
import { AuthorizationEditorComponent } from '../../../requests/components/authorization-editor/authorization-editor.component';
import { BodyEditorComponent } from '../../../requests/components/body-editor/body-editor.component';
import { KeyValueTableComponent } from '../../../requests/components/key-value-table/key-value-table.component';
import { WorkspaceSidebarComponent } from '../../../requests/components/workspace-sidebar/workspace-sidebar.component';
import { EnvironmentEditorModalComponent } from '../../../environments/components/environment-editor-modal/environment-editor-modal.component';
import {
  defaultAuth,
  type KeyValueRow,
  type RequestAuthConfig,
} from '../../../requests/models/workspace.models';
import {
  RestWorkspaceApiService,
  type CollectionRow,
  type HistoryEntryDto,
} from '../../../requests/services/rest-workspace-api.service';
import { WorkspacePersistenceService } from '../../../requests/services/workspace-persistence.service';
import {
  authPayload,
  parseAuthFromUnknown,
} from '../../../requests/utils/request-auth.utils';
import type { WsUiStatus } from '../../models/websocket-workspace.models';
import { WebsocketWorkspaceApiService } from '../../services/websocket-workspace-api.service';
import { WebsocketWorkspacePersistenceService } from '../../services/websocket-workspace-persistence.service';
import { buildWsHandshakeHeaders } from '../../utils/ws-handshake-headers';

type StreamLineKind = 'status' | 'in' | 'out' | 'error';

interface StreamLine {
  id: string;
  kind: StreamLineKind;
  title: string;
  body: string;
}

@Component({
  selector: 'app-websocket-workspace-page',
  standalone: true,
  imports: [
    KeyValueTableComponent,
    BodyEditorComponent,
    WorkspaceSidebarComponent,
    EnvironmentEditorModalComponent,
    AuthorizationEditorComponent,
  ],
  templateUrl: './websocket-workspace.component.html',
})
export class WebsocketWorkspacePageComponent implements OnDestroy {
  private readonly api = inject(RestWorkspaceApiService);
  private readonly wsApi = inject(WebsocketWorkspaceApiService);
  readonly ui = inject(WorkspacePersistenceService);
  readonly store = inject(WebsocketWorkspacePersistenceService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly streamBox =
    viewChild<ElementRef<HTMLElement>>('streamBox');

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

  readonly sessionId = signal<string | null>(null);
  readonly connStatus = signal<WsUiStatus>('idle');
  readonly streamLines = signal<StreamLine[]>([]);
  readonly autoScroll = signal(true);
  readonly streamPaused = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly sending = signal(false);

  private eventSource: EventSource | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshMeta();
    }
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
    if (p === 'SOAP') {
      storePendingHistoryReplay(entry);
      void this.router.navigate(['/app/soap']);
      return;
    }
  }

  handshakeUrl(input: string): void {
    this.store.patch({ url: input });
  }

  protocolsInput(text: string): void {
    this.store.patch({ protocolsText: text });
  }

  onHeadersChange(rows: KeyValueRow[]): void {
    this.store.patch({ headerRows: rows });
  }

  onAuthChange(auth: RequestAuthConfig): void {
    this.store.patch({ auth });
  }

  onSendDraftChange(text: string): void {
    this.store.patch({ sendDraft: text });
  }

  toggleAutoScroll(): void {
    this.autoScroll.update((v) => !v);
  }

  togglePauseStream(): void {
    this.streamPaused.update((v) => !v);
  }

  clearStream(): void {
    this.streamLines.set([]);
  }

  onEnvChange(id: string): void {
    this.ui.setSelectedEnvironmentId(id);
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

  connect(): void {
    if (typeof window === 'undefined') return;
    const prevSid = this.sessionId();
    this.closeEventSourceOnly();
    if (prevSid) {
      this.wsApi.disconnect(prevSid).subscribe({ error: () => undefined });
    }
    this.sessionId.set(null);
    this.errorMessage.set(null);
    const h = this.store.handshake();
    let url = h.url.trim();
    if (!url) {
      this.errorMessage.set('Indique um endpoint ws:// ou wss://');
      return;
    }
    const auth = h.auth;
    if (
      auth.type === 'apiKey' &&
      (auth.apiKeyAddTo ?? 'header') === 'query' &&
      auth.apiKeyValue?.trim()
    ) {
      try {
        const u = new URL(url);
        const name = auth.apiKeyName?.trim() || 'api_key';
        u.searchParams.set(name, auth.apiKeyValue);
        url = u.toString();
      } catch {
        this.errorMessage.set('URL inválida para query auth.');
        return;
      }
    }
    const protocols = h.protocolsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const headers = buildWsHandshakeHeaders(h.headerRows, h.auth);
    const envId = this.ui.selectedEnvironmentId().trim();
    this.connStatus.set('connecting');
    this.wsApi
      .connect({
        url,
        protocols: protocols.length ? protocols : undefined,
        headers: Object.keys(headers).length ? headers : undefined,
        environmentId: envId || undefined,
      })
      .subscribe({
        next: ({ sessionId }) => {
          this.sessionId.set(sessionId);
          this.connStatus.set('connecting');
          this.openEventSource(sessionId);
        },
        error: (err: HttpErrorResponse) => {
          this.connStatus.set('error');
          this.errorMessage.set(this.httpErr(err));
        },
      });
  }

  disconnect(): void {
    const sid = this.sessionId();
    this.teardownStream(true);
    if (sid) {
      this.wsApi.disconnect(sid).subscribe({ error: () => undefined });
    }
    this.connStatus.set('closed');
  }

  reconnect(): void {
    this.disconnect();
    setTimeout(() => this.connect(), 0);
  }

  send(): void {
    const sid = this.sessionId();
    if (!sid || this.connStatus() !== 'open') {
      this.errorMessage.set('Sem sessão aberta.');
      return;
    }
    const payload = this.store.handshake().sendDraft;
    this.sending.set(true);
    this.errorMessage.set(null);
    this.wsApi.send(sid, payload).subscribe({
      next: () => {
        this.sending.set(false);
        this.maybeScroll();
      },
      error: (err: HttpErrorResponse) => {
        this.sending.set(false);
        this.errorMessage.set(this.httpErr(err));
      },
    });
  }

  saveToCollection(): void {
    const cid = this.saveCollectionId();
    const h = this.store.handshake();
    if (!cid) return;
    const headers = buildWsHandshakeHeaders(h.headerRows, h.auth);
    this.api
      .saveRequestToCollection(cid, {
        method: 'WS',
        url: h.url.trim(),
        headers,
        body: h.sendDraft?.trim() ? h.sendDraft : null,
        protocol: 'WEBSOCKET',
        authConfig: authPayload(h.auth),
      })
      .subscribe(() => this.refreshMeta());
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
          .filter((r) => (r.protocol ?? 'REST') === 'WEBSOCKET')
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

  loadStored(r: {
    id: string;
    method: string;
    url: string;
    headers: unknown;
    body: string | null;
    authConfig?: unknown;
  }): void {
    const headers: KeyValueRow[] = toHeaderRows(r.headers);
    const auth = parseAuthFromUnknown(r.authConfig) ?? defaultAuth();
    this.store.patch({
      url: r.url,
      headerRows: headers.length ? headers : [{ key: '', value: '' }],
      sendDraft: r.body ?? this.store.handshake().sendDraft,
      auth,
    });
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
                .filter((r) => (r.protocol ?? 'REST') === 'WEBSOCKET')
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

  statusDotClass(): string {
    const s = this.connStatus();
    if (s === 'open') return 'bg-emerald-400 shadow-emerald-400/40';
    if (s === 'connecting') return 'bg-amber-400 shadow-amber-400/40';
    if (s === 'error') return 'bg-rose-400 shadow-rose-400/40';
    return 'bg-slate-500 shadow-slate-500/30';
  }

  statusLabel(): string {
    const s = this.connStatus();
    if (s === 'open') return 'Ligado';
    if (s === 'connecting') return 'A ligar…';
    if (s === 'error') return 'Erro';
    if (s === 'closed') return 'Desligado';
    return 'Pronto';
  }

  ngOnDestroy(): void {
    this.teardownStream(true);
  }

  private openEventSource(sessionId: string): void {
    this.closeEventSourceOnly();
    const url = this.wsApi.streamUrl(sessionId);
    const es = new EventSource(url);
    this.eventSource = es;
    es.onmessage = (ev) => {
      try {
        const raw = JSON.parse(ev.data as string) as {
          type: string;
          state?: string;
          message?: string;
          direction?: string;
          payload?: string;
          binary?: boolean;
          at?: string;
        };
        if (raw.type === 'status') {
          const st = raw.state;
          if (st === 'open') this.connStatus.set('open');
          else if (st === 'connecting') this.connStatus.set('connecting');
          else if (st === 'closed') this.connStatus.set('closed');
          else if (st === 'error') this.connStatus.set('error');
          this.pushLine({
            kind: st === 'error' ? 'error' : 'status',
            title:
              st === 'open'
                ? 'Ligado'
                : st === 'connecting'
                  ? 'A ligar'
                  : st === 'closed'
                    ? 'Fechado'
                    : st === 'error'
                      ? 'Erro'
                      : String(st),
            body: raw.message ?? '',
          });
        } else if (raw.type === 'message') {
          const dir = raw.direction === 'out' ? 'out' : 'in';
          const bin = Boolean(raw.binary);
          const title =
            dir === 'out'
              ? '[ENVIADO]'
              : bin
                ? '[RECEBIDO — binário base64]'
                : '[RECEBIDO]';
          this.pushLine({
            kind: dir,
            title: `${raw.at ? `${raw.at} ` : ''}${title}`,
            body: raw.payload ?? '',
          });
        }
      } catch {
        this.pushLine({
          kind: 'error',
          title: '[parse]',
          body: String(ev.data),
        });
      }
      this.maybeScroll();
    };
    es.onerror = () => {
      this.connStatus.set('error');
      this.errorMessage.set('Stream SSE interrompido (rede ou sessão expirada).');
      this.closeEventSourceOnly();
    };
  }

  private pushLine(partial: Omit<StreamLine, 'id'>): void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.streamLines.update((list) => [...list, { ...partial, id }]);
  }

  private maybeScroll(): void {
    if (!this.autoScroll() || this.streamPaused()) return;
    queueMicrotask(() => {
      const el = this.streamBox()?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  private closeEventSourceOnly(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private teardownStream(callDisconnect: boolean): void {
    this.closeEventSourceOnly();
    const sid = this.sessionId();
    if (callDisconnect && sid) {
      this.wsApi.disconnect(sid).subscribe({ error: () => undefined });
    }
    this.sessionId.set(null);
  }

  private httpErr(err: HttpErrorResponse): string {
    const e = err.error as { error?: { message?: string } } | string;
    return typeof e === 'string'
      ? e
      : (e?.error as { message?: string })?.message ??
          JSON.stringify(err.error ?? err.message);
  }
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
