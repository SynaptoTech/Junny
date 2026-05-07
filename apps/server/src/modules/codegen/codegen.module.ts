import { Module } from '@nestjs/common';
import { CodegenRoadmapController } from './codegen-roadmap.controller';

@Module({
  controllers: [CodegenRoadmapController],
})
export class CodegenModule {}
