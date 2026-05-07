import { Module } from '@nestjs/common';
import { MockRoadmapController } from './mock-roadmap.controller';

@Module({
  controllers: [MockRoadmapController],
})
export class MockModule {}
