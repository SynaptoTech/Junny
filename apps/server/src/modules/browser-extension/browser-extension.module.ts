import { Module } from '@nestjs/common';
import { BrowserExtensionRoadmapController } from './browser-extension-roadmap.controller';

@Module({
  controllers: [BrowserExtensionRoadmapController],
})
export class BrowserExtensionModule {}
