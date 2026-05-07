import { Module } from '@nestjs/common';
import { InterceptorRoadmapController } from './interceptor-roadmap.controller';

@Module({
  controllers: [InterceptorRoadmapController],
})
export class InterceptorModule {}
