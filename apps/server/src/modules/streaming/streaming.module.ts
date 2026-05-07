import { Module } from '@nestjs/common';
import { StreamingRoadmapController } from './streaming-roadmap.controller';

@Module({
  controllers: [StreamingRoadmapController],
})
export class StreamingModule {}
