import { Module } from '@nestjs/common';
import { AiGeneratorRoadmapController } from './ai-generator-roadmap.controller';

@Module({
  controllers: [AiGeneratorRoadmapController],
})
export class AiGeneratorModule {}
