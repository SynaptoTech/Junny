import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HistoryModule } from '../history/history.module';
import { HealthController } from './health.controller';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { RestRequestController } from './rest-request.controller';

@Module({
  imports: [HistoryModule, AuthModule],
  controllers: [HealthController, ProxyController, RestRequestController],
  providers: [ProxyService],
})
export class RestModule {}
