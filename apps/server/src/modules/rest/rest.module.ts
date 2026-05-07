import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  controllers: [HealthController, ProxyController],
  providers: [ProxyService],
})
export class RestModule {}
