import { Module } from '@nestjs/common';
import { VaultRoadmapController } from './vault-roadmap.controller';

@Module({
  controllers: [VaultRoadmapController],
})
export class VaultModule {}
