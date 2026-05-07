import { Module } from '@nestjs/common';
import { WorkflowsRoadmapController } from './workflows-roadmap.controller';

@Module({
  controllers: [WorkflowsRoadmapController],
})
export class WorkflowsModule {}
