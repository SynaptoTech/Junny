import { Module } from '@nestjs/common';
import { OfficialRoadmapController } from './official-roadmap.controller';

@Module({
  controllers: [OfficialRoadmapController],
})
export class OfficialModule {}
