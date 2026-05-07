import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { HistoryModule } from '../history/history.module';
import { SoapRequestController } from './soap-request.controller';
import { SoapProxyService } from './soap-proxy.service';

@Module({
  imports: [PrismaModule, HistoryModule, AuthModule],
  controllers: [SoapRequestController],
  providers: [SoapProxyService],
})
export class SoapModule {}
