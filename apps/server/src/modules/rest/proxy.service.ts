import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, type Method } from 'axios';
import { PrismaService } from '../../config/prisma.service';
import {
  MAX_HISTORY_JSON_CHARS,
  ProxyExecuteDto,
} from './dto/proxy-execute.dto';

export interface ProxyResult {
  status: number;
  headers: Record<string, string>;
  data: unknown;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: ProxyExecuteDto): Promise<ProxyResult> {
    const started = Date.now();
    try {
      const response = await axios.request({
        url: dto.url,
        method: dto.method.toUpperCase() as Method,
        headers: dto.headers ?? {},
        data: dto.body,
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
      };

      await this.saveHistory(dto, result, duration).catch((err) =>
        this.logger.warn(`Histórico não persistido: ${String(err)}`),
      );

      return result;
    } catch (err) {
      const duration = Date.now() - started;
      const ax = err as AxiosError;
      const message = ax.message ?? 'Proxy error';
      this.logger.warn(message);

      await this.saveHistory(
        dto,
        {
          status: ax.response?.status ?? 0,
          headers: ax.response?.headers
            ? this.flattenHeaders(ax.response.headers as Record<string, unknown>)
            : {},
          data: ax.response?.data ?? { message },
        },
        duration,
      ).catch(() => undefined);

      throw new HttpException({ message }, HttpStatus.BAD_GATEWAY);
    }
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

  private truncateForDb(value: unknown): unknown {
    try {
      const s = JSON.stringify(value);
      if (s.length <= MAX_HISTORY_JSON_CHARS) {
        return JSON.parse(s) as unknown;
      }
      return {
        _truncated: true,
        length: s.length,
        preview: s.slice(0, 8000),
      };
    } catch {
      return { _error: 'unserializable' };
    }
  }

  private async saveHistory(
    dto: ProxyExecuteDto,
    result: ProxyResult,
    duration: number,
  ): Promise<void> {
    await this.prisma.historyEntry.create({
      data: {
        request: this.truncateForDb(dto) as object,
        response: this.truncateForDb(result) as object,
        status: result.status,
        duration,
      },
    });
  }
}
