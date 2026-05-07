import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../core/environments/environment';

export interface WsConnectPayload {
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
  environmentId?: string;
}

@Injectable({ providedIn: 'root' })
export class WebsocketWorkspaceApiService {
  private readonly http = inject(HttpClient);
  private readonly origin = environment.apiOrigin;

  connect(body: WsConnectPayload): Observable<{ sessionId: string }> {
    return this.http.post<{ sessionId: string }>(
      `${this.origin}/api/websocket/connect`,
      body,
    );
  }

  send(sessionId: string, payload: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(
      `${this.origin}/api/websocket/sessions/${encodeURIComponent(sessionId)}/send`,
      { payload },
    );
  }

  disconnect(sessionId: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(
      `${this.origin}/api/websocket/sessions/${encodeURIComponent(sessionId)}/disconnect`,
      {},
    );
  }

  streamUrl(sessionId: string): string {
    return `${this.origin}/api/websocket/sessions/${encodeURIComponent(sessionId)}/stream`;
  }
}
