import { Module } from '@nestjs/common';
import { WebSocketController } from './websocket.controller';
import { WebSocketRelayService } from './websocket-relay.service';

@Module({
  controllers: [WebSocketController],
  providers: [WebSocketRelayService],
  exports: [WebSocketRelayService],
})
export class WebSocketModule {}
