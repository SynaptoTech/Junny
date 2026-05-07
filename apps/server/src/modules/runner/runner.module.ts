import { Module } from '@nestjs/common';
import { RunnerRoadmapController } from './runner-roadmap.controller';

@Module({
  controllers: [RunnerRoadmapController],
})
export class RunnerModule {}
