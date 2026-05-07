import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../config/prisma.service';

@ApiTags('health')
@Controller('v1/health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Healthcheck da API e SQLite' })
  async get() {
    let database: 'ok' | 'error' = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'error';
    }
    return {
      service: 'junny-api',
      status: database === 'ok' ? 'ok' : 'degraded',
      database,
    };
  }
}
