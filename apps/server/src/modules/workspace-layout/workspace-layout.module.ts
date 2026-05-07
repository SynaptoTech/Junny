import { Module } from '@nestjs/common';
import { WorkspaceLayoutRoadmapController } from './workspace-layout-roadmap.controller';

@Module({
  controllers: [WorkspaceLayoutRoadmapController],
})
export class WorkspaceLayoutModule {}
