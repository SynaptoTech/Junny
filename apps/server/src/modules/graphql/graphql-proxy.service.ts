import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { PrismaService } from '../../config/prisma.service';
import { AuthMergeService } from '../auth/auth-merge.service';
import { HistoryService } from '../history/history.service';
import {
  MAX_HISTORY_JSON_CHARS,
} from '../rest/dto/proxy-execute.dto';
import type { GraphqlExecuteDto } from './dto/graphql-execute.dto';

export interface GraphqlProxyResult {
  status: number;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
}

@Injectable()
export class GraphqlProxyService {
  private readonly logger = new Logger(GraphqlProxyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly history: HistoryService,
    private readonly authMerge: AuthMergeService,
  ) {}

  async execute(dto: GraphqlExecuteDto): Promise<GraphqlProxyResult> {
    const resolved = await this.resolveEnvironment(dto);
    const baseHeaders = {
      'Content-Type': 'application/json',
      ...(resolved.headers ?? {}),
    };
    const { url: requestUrl, headers: mergedHeaders } =
      this.authMerge.mergeUrlAndHeaders(
        resolved.url,
        resolved.auth,
        baseHeaders,
      );
    const started = Date.now();
    try {
      const response = await axios.post(
        requestUrl,
        {
          query: resolved.query,
          variables: resolved.variables ?? {},
        },
        {
          headers: mergedHeaders,
          timeout: 60_000,
          validateStatus: () => true,
          maxContentLength: MAX_HISTORY_JSON_CHARS,
          maxBodyLength: MAX_HISTORY_JSON_CHARS,
        },
      );

      const duration = Date.now() - started;
      const result: GraphqlProxyResult = {
        status: response.status,
        headers: this.flattenHeaders(response.headers),
        data: response.data,
        duration,
      };

      await this.saveHistory(dto, resolved, result, duration).catch((err) =>
        this.logger.warn(`Histórico GraphQL não persistido: ${String(err)}`),
      );

      return result;
    } catch (err) {
      const duration = Date.now() - started;
      const ax = err as AxiosError;
      const message = ax.message ?? 'GraphQL proxy error';
      this.logger.warn(message);

      await this.saveHistory(
        dto,
        resolved,
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

  private async resolveEnvironment(
    dto: GraphqlExecuteDto,
  ): Promise<GraphqlExecuteDto> {
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
      query: this.substitute(dto.query, map),
      variables: dto.variables
        ? (this.substituteDeep(dto.variables, map) as Record<string, unknown>)
        : undefined,
      headers: dto.headers ? this.substituteRecord(dto.headers, map) : undefined,
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

  private substituteDeep(
    val: unknown,
    map: Record<string, string>,
  ): unknown {
    if (val === null || val === undefined) return val;
    if (typeof val === 'string') return this.substitute(val, map);
    if (Array.isArray(val)) return val.map((x) => this.substituteDeep(x, map));
    if (typeof val === 'object') {
      const o: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        o[k] = this.substituteDeep(v, map);
      }
      return o;
    }
    return val;
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
    original: GraphqlExecuteDto,
    resolved: GraphqlExecuteDto,
    result: GraphqlProxyResult,
    duration: number,
  ): Promise<void> {
    await this.history.append({
      request: {
        protocol: 'GRAPHQL',
        url: original.url,
        query: original.query,
        variables: original.variables ?? {},
        headers: original.headers ?? {},
        environmentId: original.environmentId,
        auth: this.authMerge.redactAuth(resolved.auth),
      },
      response: result,
      status: result.status,
      duration,
      protocol: 'GRAPHQL',
      method: 'POST',
      url: original.url,
    });
  }
}
