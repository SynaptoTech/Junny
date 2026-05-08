import { Injectable, effect, inject, signal } from '@angular/core';
import { defaultAuth } from '../../requests/models/workspace.models';
import type { WsHandshakePersistence } from '../models/websocket-workspace.models';
import { WorkspaceContextService } from '../../../shared/services/workspace-context.service';

const LEGACY_KEY = 'junny-ws-workspace-v1';

function storageKey(workspaceId: string): string {
  return `junny-ws-workspace-v2:${workspaceId}`;
}

function defaultState(): WsHandshakePersistence {
  return {
    url: 'wss://echo.websocket.events/.ws',
    protocolsText: '',
    headerRows: [{ key: '', value: '' }],
    auth: defaultAuth(),
    sendDraft: '{\n  "hello": "junny"\n}',
  };
}

@Injectable({ providedIn: 'root' })
export class WebsocketWorkspacePersistenceService {
  private readonly ctx = inject(WorkspaceContextService);

  readonly handshake = signal<WsHandshakePersistence>(defaultState());

  constructor() {
    this.migrateLegacyOnce();

    effect(() => {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      this.hydrate(wid);
    });

    effect(() => {
      const wid = this.ctx.activeWorkspaceId();
      if (!wid) return;
      void this.handshake();
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

  private hydrate(workspaceId: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKey(workspaceId));
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<WsHandshakePersistence>;
      this.handshake.set({
        ...defaultState(),
        ...parsed,
        headerRows: parsed.headerRows?.length
          ? parsed.headerRows
          : defaultState().headerRows,
        auth: parsed.auth ?? defaultAuth(),
      });
    } catch {
      /* ignore */
    }
  }

  persist(workspaceId = this.ctx.activeWorkspaceId()): void {
    if (typeof localStorage === 'undefined') return;
    if (!workspaceId) return;
    localStorage.setItem(storageKey(workspaceId), JSON.stringify(this.handshake()));
  }

  patch(part: Partial<WsHandshakePersistence>): void {
    this.handshake.update((h) => ({ ...h, ...part }));
    this.persist();
  }
}
