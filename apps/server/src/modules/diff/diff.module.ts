import { Module } from '@nestjs/common';
import { DiffRoadmapController } from './diff-roadmap.controller';

@Module({
  controllers: [DiffRoadmapController],
})
export class DiffModule {}
