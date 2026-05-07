import { Module } from '@nestjs/common';
import { AiOpenapiRoadmapController } from './ai-openapi-roadmap.controller';

@Module({
  controllers: [AiOpenapiRoadmapController],
})
export class AiOpenapiModule {}
