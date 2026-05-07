import {
  BadRequestException,
  Injectable,
  Logger,
  MessageEvent,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Observable, ReplaySubject, map } from 'rxjs';
import WebSocket from 'ws';
import { PrismaService } from '../../config/prisma.service';
import type { WebSocketConnectDto } from './dto/websocket-connect.dto';

const MAX_EVENTS_BUFFER = 250;
const MAX_SSE_PAYLOAD_CHARS = 120_000;

export type WsStreamEvent =
  | {
      type: 'status';
      state: 'connecting' | 'open' | 'closed' | 'error';
      message?: string;
    }
  | {
      type: 'message';
      direction: 'in' | 'out';
      payload: string;
      bytes: number;
      binary: boolean;
      at: string;
    };

interface Session {
  events$: ReplaySubject<WsStreamEvent>;
  ws: WebSocket;
  url: string;
}

@Injectable()
export class WebSocketRelayService implements OnModuleDestroy {
  private readonly logger = new Logger(WebSocketRelayService.name);
  private readonly sessions = new Map<string, Session>();

  constructor(private readonly prisma: PrismaService) {}

  onModuleDestroy(): void {
    for (const id of this.sessions.keys()) {
      this.forceDisconnect(id);
    }
  }

  async connect(dto: WebSocketConnectDto): Promise<{ sessionId: string }> {
    const resolved = await this.resolveConnect(dto);
    const sessionId = randomUUID();
    const events$ = new ReplaySubject<WsStreamEvent>(MAX_EVENTS_BUFFER);

    events$.next({ type: 'status', state: 'connecting' });

    const protocols =
      resolved.protocols?.filter((p) => p.trim().length > 0) ?? [];
    const protoArg = protocols.length > 0 ? protocols : undefined;

    const opts: WebSocket.ClientOptions = {
      headers: resolved.headers,
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
    };

    const ws =
      protoArg !== undefined
        ? new WebSocket(resolved.url, protoArg, opts)
        : new WebSocket(resolved.url, opts);

    this.sessions.set(sessionId, { events$, ws, url: dto.url });

    ws.on('open', () => {
      events$.next({ type: 'status', state: 'open' });
    });

    ws.on('message', (data, isBinary) => {
      const binary = Boolean(isBinary);
      let payload: string;
      let bytes: number;
      if (binary) {
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
        bytes = buf.length;
        payload = buf.toString('base64');
      } else {
        payload = String(data);
        bytes = Buffer.byteLength(payload, 'utf8');
      }
      events$.next({
        type: 'message',
        direction: 'in',
        payload: this.truncatePayload(payload),
        bytes,
        binary,
        at: new Date().toISOString(),
      });
    });

    ws.on('close', () => {
      events$.next({ type: 'status', state: 'closed' });
      events$.complete();
      this.sessions.delete(sessionId);
    });

    ws.on('error', (err: Error) => {
      this.logger.warn(`WS relay ${sessionId}: ${err.message}`);
      events$.next({
        type: 'status',
        state: 'error',
        message: err.message,
      });
    });

    return { sessionId };
  }

  stream(sessionId: string): Observable<MessageEvent> {
    const s = this.sessions.get(sessionId);
    if (!s) {
      throw new NotFoundException(`Sessão WebSocket "${sessionId}" não encontrada`);
    }
    return s.events$.asObservable().pipe(
      map(
        (ev) =>
          ({
            data: JSON.stringify(ev),
          }) as MessageEvent,
      ),
    );
  }

  send(sessionId: string, payload: string): void {
    const s = this.sessions.get(sessionId);
    if (!s) {
      throw new NotFoundException(`Sessão "${sessionId}" não encontrada`);
    }
    if (s.ws.readyState !== WebSocket.OPEN) {
      throw new BadRequestException('Conexão não está aberta');
    }
    s.ws.send(payload);
    s.events$.next({
      type: 'message',
      direction: 'out',
      payload: this.truncatePayload(payload),
      bytes: Buffer.byteLength(payload, 'utf8'),
      binary: false,
      at: new Date().toISOString(),
    });
  }

  disconnect(sessionId: string): { ok: boolean } {
    const s = this.sessions.get(sessionId);
    if (!s) {
      throw new NotFoundException(`Sessão "${sessionId}" não encontrada`);
    }
    try {
      s.ws.close();
    } catch {
      /* ignore */
    }
    return { ok: true };
  }

  private forceDisconnect(sessionId: string): void {
    const s = this.sessions.get(sessionId);
    if (!s) return;
    try {
      s.ws.terminate();
    } catch {
      /* ignore */
    }
    this.sessions.delete(sessionId);
  }

  private async resolveConnect(
    dto: WebSocketConnectDto,
  ): Promise<{ url: string; headers?: Record<string, string>; protocols?: string[] }> {
    if (!dto.environmentId?.trim()) {
      return {
        url: dto.url.trim(),
        headers: dto.headers,
        protocols: dto.protocols,
      };
    }
    const env = await this.prisma.environment.findUnique({
      where: { id: dto.environmentId },
      include: { variables: true },
    });
    if (!env) {
      throw new BadRequestException(
        `Environment "${dto.environmentId}" não encontrado`,
      );
    }
    const map = Object.fromEntries(env.variables.map((v) => [v.key, v.value]));
    return {
      url: this.substitute(dto.url.trim(), map),
      headers: dto.headers ? this.substituteRecord(dto.headers, map) : undefined,
      protocols: dto.protocols?.map((p) => this.substitute(p, map)),
    };
  }

  private substitute(text: string, map: Record<string, string>): string {
    let out = text;
    for (const [k, v] of Object.entries(map)) {
      out = out.split(`{{${k}}}`).join(v);
    }
    return out;
  }

  private substituteRecord(
    r: Record<string, string>,
    map: Record<string, string>,
  ): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) {
      out[k] = this.substitute(v, map);
    }
    return out;
  }

  private truncatePayload(s: string): string {
    if (s.length <= MAX_SSE_PAYLOAD_CHARS) return s;
    return `${s.slice(0, MAX_SSE_PAYLOAD_CHARS)}… [truncado]`;
  }
}
