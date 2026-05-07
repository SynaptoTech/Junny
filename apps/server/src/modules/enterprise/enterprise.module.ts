import { Module } from '@nestjs/common';
import { EnterpriseRoadmapController } from './enterprise-roadmap.controller';

@Module({
  controllers: [EnterpriseRoadmapController],
})
export class EnterpriseModule {}
