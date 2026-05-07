import { Module } from '@nestjs/common';
import { PluginsRoadmapController } from './plugins-roadmap.controller';

@Module({
  controllers: [PluginsRoadmapController],
})
export class PluginsModule {}
