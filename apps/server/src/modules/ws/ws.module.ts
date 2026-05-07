import { Module } from '@nestjs/common';
import { JunnyGateway } from './junny.gateway';

@Module({
  providers: [JunnyGateway],
})
export class WsModule {}
