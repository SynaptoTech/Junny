import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { OpenApiController } from './openapi.controller';
import { OpenApiImportService } from './openapi-import.service';

@Module({
  imports: [PrismaModule],
  controllers: [OpenApiController],
  providers: [OpenApiImportService],
})
export class OpenApiModule {}
