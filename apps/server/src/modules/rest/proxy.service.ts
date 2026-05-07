import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError, type Method } from 'axios';
import { PrismaService } from '../../config/prisma.service';
import { AuthMergeService } from '../auth/auth-merge.service';
import { HistoryService } from '../history/history.service';
import {
  MAX_HISTORY_JSON_CHARS,
  ProxyExecuteDto,
} from './dto/proxy-execute.dto';

export interface ProxyResult {
  status: number;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly history: HistoryService,
    private readonly authMerge: AuthMergeService,
  ) {}

  async execute(dto: ProxyExecuteDto): Promise<ProxyResult> {
    const resolved = await this.resolveEnvironment(dto);
    const merged = this.authMerge.mergeRest(
      resolved.auth,
      resolved.headers,
      resolved.params,
    );
    const started = Date.now();
    try {
      const url = this.applyQueryParams(resolved.url, merged.params);
      const response = await axios.request({
        url,
        method: resolved.method.toUpperCase() as Method,
        headers: merged.headers,
        data: resolved.body,
        timeout: 60_000,
        validateStatus: () => true,
        maxContentLength: MAX_HISTORY_JSON_CHARS,
        maxBodyLength: MAX_HISTORY_JSON_CHARS,
      });

      const duration = Date.now() - started;
      const result: ProxyResult = {
        status: response.status,
        headers: this.flattenHeaders(response.headers),
        data: response.data,
        duration,
      };

      await this.saveHistory(
        this.authMerge.redactProxyDto(resolved),
        result,
        duration,
      ).catch((err) =>
        this.logger.warn(`Histórico não persistido: ${String(err)}`),
      );

      return result;
    } catch (err) {
      const duration = Date.now() - started;
      const ax = err as AxiosError;
      const message = ax.message ?? 'Proxy error';
      this.logger.warn(message);

      await this.saveHistory(
        this.authMerge.redactProxyDto(resolved),
        {
          status: ax.response?.status ?? 0,
          headers: ax.response?.headers
            ? this.flattenHeaders(ax.response.headers as Record<string, unknown>)
            : {},
          data: ax.response?.data ?? { message },
          duration,
        },
        duration,
      ).catch(() => undefined);

      throw new HttpException({ message }, HttpStatus.BAD_GATEWAY);
    }
  }

  private async resolveEnvironment(dto: ProxyExecuteDto): Promise<ProxyExecuteDto> {
    if (!dto.environmentId?.trim()) return dto;
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
    const authNext = this.authMerge.substituteAuth(dto.auth, map);
    return {
      ...dto,
      url: this.substitute(dto.url, map),
      headers: dto.headers
        ? this.substituteRecord(dto.headers, map)
        : undefined,
      params: dto.params
        ? this.substituteRecord(dto.params, map)
        : undefined,
      body: this.substituteBody(dto.body, map),
      auth: authNext ?? dto.auth,
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

  private substituteBody(body: unknown, map: Record<string, string>): unknown {
    if (body === undefined || body === null) return body;
    if (typeof body === 'string') return this.substitute(body, map);
    return body;
  }

  private applyQueryParams(
    url: string,
    params?: Record<string, string>,
  ): string {
    if (!params || Object.keys(params).length === 0) return url;
    const u = new URL(url);
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === '') continue;
      u.searchParams.set(k, v);
    }
    return u.toString();
  }

  private flattenHeaders(
    headers: Record<string, unknown>,
  ): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      if (v === undefined) continue;
      out[k] = Array.isArray(v) ? v.join(', ') : String(v);
    }
    return out;
  }

  private async saveHistory(
    dto: ProxyExecuteDto,
    result: ProxyResult,
    duration: number,
  ): Promise<void> {
    await this.history.append({
      request: dto,
      response: result,
      status: result.status,
      duration,
      protocol: 'REST',
      method: dto.method,
      url: dto.url,
    });
  }
}
