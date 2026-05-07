import { Module } from '@nestjs/common';
import { ProfilerRoadmapController } from './profiler-roadmap.controller';

@Module({
  controllers: [ProfilerRoadmapController],
})
export class ProfilerModule {}
