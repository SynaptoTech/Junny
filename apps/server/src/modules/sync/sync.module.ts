import { Module } from '@nestjs/common';
import { SyncRoadmapController } from './sync-roadmap.controller';

@Module({
  controllers: [SyncRoadmapController],
})
export class SyncModule {}
