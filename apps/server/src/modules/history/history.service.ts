import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  list(skip: number, take: number) {
    const safeTake = Math.min(Math.max(take, 1), 200);
    const safeSkip = Math.max(skip, 0);
    return this.prisma.$transaction([
      this.prisma.historyEntry.findMany({
        orderBy: { createdAt: 'desc' },
        skip: safeSkip,
        take: safeTake,
      }),
      this.prisma.historyEntry.count(),
    ]).then(([items, total]) => ({
      items,
      total,
      skip: safeSkip,
      take: safeTake,
    }));
  }
}
