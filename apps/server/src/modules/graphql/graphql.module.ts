import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { HistoryModule } from '../history/history.module';
import { GraphqlRequestController } from './graphql-request.controller';
import { GraphqlProxyService } from './graphql-proxy.service';

@Module({
  imports: [PrismaModule, HistoryModule, AuthModule],
  controllers: [GraphqlRequestController],
  providers: [GraphqlProxyService],
})
export class GraphqlModule {}
