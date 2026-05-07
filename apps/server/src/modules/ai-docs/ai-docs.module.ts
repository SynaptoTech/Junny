import { Module } from '@nestjs/common';
import { AiDocsRoadmapController } from './ai-docs-roadmap.controller';

@Module({
  controllers: [AiDocsRoadmapController],
})
export class AiDocsModule {}
