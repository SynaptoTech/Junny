import { Module } from '@nestjs/common';
import { DesignSystemController } from './design-system.controller';

@Module({
  controllers: [DesignSystemController],
})
export class DesignSystemModule {}
