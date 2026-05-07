import { Module } from '@nestjs/common';
import { AiAnalyzerRoadmapController } from './ai-analyzer-roadmap.controller';

@Module({
  controllers: [AiAnalyzerRoadmapController],
})
export class AiAnalyzerModule {}
