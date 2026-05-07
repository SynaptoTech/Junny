import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class WebSocketConnectDto {
  @ApiProperty({
    example: 'wss://echo.websocket.events/.ws',
    description: 'Endpoint ws:// ou wss:// (suporta {{variáveis}} do ambiente)',
  })
  @IsString()
  @Matches(/^wss?:\/\/.+/i, {
    message: 'URL deve começar por ws:// ou wss://',
  })
  @MaxLength(4096)
  url!: string;

  @ApiPropertyOptional({
    description: 'Subprotocolos WebSocket (opcional)',
    example: ['graphql-ws'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  protocols?: string[];

  @ApiPropertyOptional({
    description:
      'Headers do handshake (suportados pelo relay server-side; substituição {{var}})',
    example: { Authorization: 'Bearer {{token}}' },
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Ambiente para resolver {{variáveis}} na URL e headers.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  environmentId?: string;
}
