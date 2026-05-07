import { Module } from '@nestjs/common';
import { TeamRoadmapController } from './team-roadmap.controller';

@Module({
  controllers: [TeamRoadmapController],
})
export class TeamModule {}
