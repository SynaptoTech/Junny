import { Module } from '@nestjs/common';
import { MonitoringRoadmapController } from './monitoring-roadmap.controller';

@Module({
  controllers: [MonitoringRoadmapController],
})
export class MonitoringModule {}
