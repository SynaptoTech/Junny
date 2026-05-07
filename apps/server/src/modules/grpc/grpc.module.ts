import { Module } from '@nestjs/common';
import { GrpcRoadmapController } from './grpc-roadmap.controller';

@Module({
  controllers: [GrpcRoadmapController],
})
export class GrpcModule {}
