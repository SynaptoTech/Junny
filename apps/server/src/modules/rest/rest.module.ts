import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/** REST — prioridade do MVP (proxy, requests, OpenAPI). */
@Module({
  controllers: [HealthController],
})
export class RestModule {}
