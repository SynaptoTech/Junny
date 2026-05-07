import { Module } from '@nestjs/common';
import { DesktopRoadmapController } from './desktop-roadmap.controller';

@Module({
  controllers: [DesktopRoadmapController],
})
export class DesktopModule {}
