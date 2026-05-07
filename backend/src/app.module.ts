import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(String(config.get('DB_PORT', 5432)), 10),
        username: config.get<string>('DB_USERNAME', 'junny_user'),
        password: config.get<string>('DB_PASSWORD', 'changeme'),
        database: config.get<string>('DB_DATABASE', 'junny'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
