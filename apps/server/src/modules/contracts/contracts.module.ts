import { Module } from '@nestjs/common';
import { ContractsRoadmapController } from './contracts-roadmap.controller';

@Module({
  controllers: [ContractsRoadmapController],
})
export class ContractsModule {}
