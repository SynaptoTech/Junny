import { Module } from '@nestjs/common';
import { SecurityRoadmapController } from './security-roadmap.controller';

@Module({
  controllers: [SecurityRoadmapController],
})
export class SecurityModule {}
