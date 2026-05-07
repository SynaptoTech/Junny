import { Module } from '@nestjs/common';
import { MarketplaceRoadmapController } from './marketplace-roadmap.controller';

@Module({
  controllers: [MarketplaceRoadmapController],
})
export class MarketplaceModule {}
