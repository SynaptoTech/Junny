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
import { MAX_HISTORY_JSON_CHARS } from '../rest/dto/proxy-execute.dto';
import type { SoapExecuteDto } from './dto/soap-execute.dto';

export interface SoapProxyResult {
  status: number;
  headers: Record<string, string>;
  /** Resposta como texto (XML). */
  data: string;
  duration: number;
}

@Injectable()
export class SoapProxyService {
  private readonly logger = new Logger(SoapProxyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly history: HistoryService,
    private readonly authMerge: AuthMergeService,
  ) {}

  async execute(dto: SoapExecuteDto): Promise<SoapProxyResult> {
    const resolved = await this.resolveEnvironment(dto);
    const baseHeaders = {
      'Content-Type': 'text/xml; charset=utf-8',
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
      const response = await axios.post<string>(requestUrl, resolved.xml, {
        headers: mergedHeaders,
        responseType: 'text',
        timeout: 120_000,
        validateStatus: () => true,
        maxContentLength: MAX_HISTORY_JSON_CHARS,
        maxBodyLength: MAX_HISTORY_JSON_CHARS,
        transformResponse: [(body) => body as string],
      });

      const duration = Date.now() - started;
      const rawData = response.data;
      const data =
        typeof rawData === 'string'
          ? rawData
          : rawData !== undefined && rawData !== null
            ? String(rawData)
            : '';

      const result: SoapProxyResult = {
        status: response.status,
        headers: this.flattenHeaders(response.headers),
        data,
        duration,
      };

      await this.saveHistory(dto, resolved, result, duration).catch((err) =>
        this.logger.warn(`Histórico SOAP não persistido: ${String(err)}`),
      );

      return result;
    } catch (err) {
      const duration = Date.now() - started;
      const ax = err as AxiosError;
      const message = ax.message ?? 'SOAP proxy error';
      this.logger.warn(message);

      await this.saveHistory(
        dto,
        resolved,
        {
          status: ax.response?.status ?? 0,
          headers: ax.response?.headers
            ? this.flattenHeaders(ax.response.headers as Record<string, unknown>)
            : {},
          data:
            typeof ax.response?.data === 'string'
              ? ax.response.data
              : JSON.stringify(ax.response?.data ?? { message }),
          duration,
        },
        duration,
      ).catch(() => undefined);

      throw new HttpException({ message }, HttpStatus.BAD_GATEWAY);
    }
  }

  private async resolveEnvironment(dto: SoapExecuteDto): Promise<SoapExecuteDto> {
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
      xml: this.substitute(dto.xml, map),
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
    original: SoapExecuteDto,
    resolved: SoapExecuteDto,
    result: SoapProxyResult,
    duration: number,
  ): Promise<void> {
    await this.history.append({
      request: {
        protocol: 'SOAP',
        url: original.url,
        xml: original.xml,
        headers: original.headers ?? {},
        environmentId: original.environmentId,
        auth: this.authMerge.redactAuth(resolved.auth),
      },
      response: result,
      status: result.status,
      duration,
      protocol: 'SOAP',
      method: 'POST',
      url: original.url,
    });
  }
}
