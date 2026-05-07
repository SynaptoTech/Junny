import { Injectable, signal } from '@angular/core';
import { defaultAuth } from '../../requests/models/workspace.models';
import type { WsHandshakePersistence } from '../models/websocket-workspace.models';

const STORAGE_KEY = 'junny-ws-workspace-v1';

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
  readonly handshake = signal<WsHandshakePersistence>(defaultState());

  constructor() {
    this.hydrate();
  }

  private hydrate(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
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

  persist(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.handshake()));
  }

  patch(part: Partial<WsHandshakePersistence>): void {
    this.handshake.update((h) => ({ ...h, ...part }));
    this.persist();
  }
}
