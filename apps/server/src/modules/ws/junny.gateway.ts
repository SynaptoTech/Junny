import { Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';

/** Gateway preparado para logs/realtime futuros (MD04 — stub). */
@WebSocketGateway({ cors: { origin: true } })
export class JunnyGateway implements OnGatewayInit {
  private readonly logger = new Logger(JunnyGateway.name);

  afterInit(): void {
    this.logger.log('WebSocket gateway inicializado (stub)');
  }
}
