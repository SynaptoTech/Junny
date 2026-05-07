import { Body, Controller, Get, MessageEvent, Param, Post, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { WebSocketConnectDto } from './dto/websocket-connect.dto';
import { WebSocketSendDto } from './dto/websocket-send.dto';
import { WebSocketRelayService } from './websocket-relay.service';

@ApiTags('websocket')
@Controller('api/websocket')
export class WebSocketController {
  constructor(private readonly relay: WebSocketRelayService) {}

  @Post('connect')
  @ApiOperation({
    summary:
      'Abre relay WebSocket no servidor (headers/subprotocolos; resolve ambiente)',
  })
  connect(@Body() dto: WebSocketConnectDto): Promise<{ sessionId: string }> {
    return this.relay.connect(dto);
  }

  @Get('sessions/:sessionId/stream')
  @Sse()
  @ApiOperation({
    summary: 'Stream SSE com eventos da sessão (status + mensagens in/out)',
  })
  stream(@Param('sessionId') sessionId: string): Observable<MessageEvent> {
    return this.relay.stream(sessionId);
  }

  @Post('sessions/:sessionId/send')
  @ApiOperation({ summary: 'Envia texto pelo socket da sessão' })
  send(
    @Param('sessionId') sessionId: string,
    @Body() dto: WebSocketSendDto,
  ): { ok: boolean } {
    this.relay.send(sessionId, dto.payload);
    return { ok: true };
  }

  @Post('sessions/:sessionId/disconnect')
  @ApiOperation({ summary: 'Fecha o socket da sessão' })
  disconnect(@Param('sessionId') sessionId: string): { ok: boolean } {
    return this.relay.disconnect(sessionId);
  }
}
