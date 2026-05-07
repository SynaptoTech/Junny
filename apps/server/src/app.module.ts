import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { EnvironmentsModule } from './modules/environments/environments.module';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { HistoryModule } from './modules/history/history.module';
import { RestModule } from './modules/rest/rest.module';
import { SoapModule } from './modules/soap/soap.module';
import { WsModule } from './modules/ws/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RestModule,
    SoapModule,
    GraphqlModule,
    HistoryModule,
    CollectionsModule,
    EnvironmentsModule,
    WsModule,
  ],
})
export class AppModule {}
