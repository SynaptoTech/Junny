import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

/** Limite alinhado ao body SOAP/GraphQL persistido. */
export const MAX_WS_SEND_CHARS = 500_000;

export class WebSocketSendDto {
  @ApiProperty({
    description: 'Texto ou JSON a enviar pelo socket',
  })
  @IsString()
  @MaxLength(MAX_WS_SEND_CHARS)
  payload!: string;
}
