import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';
import { MAX_HISTORY_JSON_CHARS } from '../rest/dto/proxy-execute.dto';

const MAX_HISTORY_ENTRIES = 1000;
const URL_COLUMN_MAX = 2048;

export type HistoryStatusGroup = 'any' | '2xx' | '3xx' | '4xx' | '5xx';

export interface HistoryListFilters {
  q?: string;
  protocol?: string;
  method?: string;
  statusGroup?: HistoryStatusGroup;
}

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  list(skip: number, take: number, filters?: HistoryListFilters) {
    const safeTake = Math.min(Math.max(take, 1), 500);
    const safeSkip = Math.max(skip, 0);
    const where = this.buildWhere(filters);
    return this.prisma.$transaction([
      this.prisma.historyEntry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: safeSkip,
        take: safeTake,
      }),
      this.prisma.historyEntry.count({ where }),
    ]).then(([items, total]) => ({
      items,
      total,
      skip: safeSkip,
      take: safeTake,
    }));
  }

  async append(params: {
    request: unknown;
    response: unknown;
    status: number;
    duration: number;
    protocol: string;
    method: string;
    url: string;
  }): Promise<void> {
    const url =
      params.url.length > URL_COLUMN_MAX
        ? `${params.url.slice(0, URL_COLUMN_MAX)}…`
        : params.url;
    await this.prisma.historyEntry.create({
      data: {
        request: this.truncateForDb(params.request) as Prisma.InputJsonValue,
        response: this.truncateForDb(params.response) as Prisma.InputJsonValue,
        status: params.status,
        duration: params.duration,
        protocol: params.protocol,
        method: params.method,
        url,
      },
    });
    await this.pruneBeyond(MAX_HISTORY_ENTRIES);
  }

  async deleteAll(): Promise<{ deleted: number }> {
    const res = await this.prisma.historyEntry.deleteMany({});
    return { deleted: res.count };
  }

  private buildWhere(filters?: HistoryListFilters): Prisma.HistoryEntryWhereInput {
    const where: Prisma.HistoryEntryWhereInput = {};
    const and: Prisma.HistoryEntryWhereInput[] = [];

    if (
      filters?.protocol &&
      ['REST', 'GRAPHQL', 'SOAP', 'WEBSOCKET'].includes(filters.protocol)
    ) {
      and.push({ protocol: filters.protocol });
    }

    if (filters?.method?.trim()) {
      and.push({ method: filters.method.trim() });
    }

    if (filters?.statusGroup && filters.statusGroup !== 'any') {
      const sg = filters.statusGroup;
      if (sg === '2xx') and.push({ status: { gte: 200, lt: 300 } });
      else if (sg === '3xx') and.push({ status: { gte: 300, lt: 400 } });
      else if (sg === '4xx') and.push({ status: { gte: 400, lt: 500 } });
      else if (sg === '5xx') and.push({ status: { gte: 500, lt: 600 } });
    }

    if (filters?.q?.trim()) {
      const q = filters.q.trim();
      and.push({
        OR: [{ url: { contains: q } }, { method: { contains: q } }],
      });
    }

    if (and.length) {
      where.AND = and;
    }
    return where;
  }

  private async pruneBeyond(max: number): Promise<void> {
    const count = await this.prisma.historyEntry.count();
    if (count <= max) return;
    const remove = count - max;
    const oldest = await this.prisma.historyEntry.findMany({
      orderBy: { createdAt: 'asc' },
      take: remove,
      select: { id: true },
    });
    if (!oldest.length) return;
    await this.prisma.historyEntry.deleteMany({
      where: { id: { in: oldest.map((o) => o.id) } },
    });
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
}
