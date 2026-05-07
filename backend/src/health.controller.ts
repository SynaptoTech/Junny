import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async get() {
    let database: 'ok' | 'error' = 'ok';
    try {
      await this.dataSource.query('SELECT 1');
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
