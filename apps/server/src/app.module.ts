import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { CollectionsModule } from './modules/collections/collections.module';
import { EnvironmentsModule } from './modules/environments/environments.module';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { HistoryModule } from './modules/history/history.module';
import { RestModule } from './modules/rest/rest.module';
import { SoapModule } from './modules/soap/soap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const database =
          config.get<string>('SQLITE_PATH') ??
          join(process.cwd(), 'data', 'junny.sqlite');
        mkdirSync(dirname(database), { recursive: true });
        return {
          type: 'sqlite' as const,
          database,
          autoLoadEntities: true,
          synchronize: config.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),
    RestModule,
    SoapModule,
    GraphqlModule,
    HistoryModule,
    CollectionsModule,
    EnvironmentsModule,
  ],
})
export class AppModule {}
