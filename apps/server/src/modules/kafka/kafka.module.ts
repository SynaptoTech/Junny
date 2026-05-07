import { Module } from '@nestjs/common';
import { KafkaRoadmapController } from './kafka-roadmap.controller';

@Module({
  controllers: [KafkaRoadmapController],
})
export class KafkaModule {}
