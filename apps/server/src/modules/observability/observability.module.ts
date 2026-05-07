import { Module } from '@nestjs/common';
import { ObservabilityRoadmapController } from './observability-roadmap.controller';

@Module({
  controllers: [ObservabilityRoadmapController],
})
export class ObservabilityModule {}
