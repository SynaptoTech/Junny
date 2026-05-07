import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // DX: allow running server without a local .env (Docker provides it).
    // Schema expects DATABASE_URL; default to sqlite file next to schema for dev.
    if (!process.env.DATABASE_URL) process.env.DATABASE_URL = 'file:./dev.db';
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
