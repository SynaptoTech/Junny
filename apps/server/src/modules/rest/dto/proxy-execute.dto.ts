import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';

const METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export class ProxyExecuteDto {
  @ApiProperty({ example: 'https://httpbin.org/get' })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;

  @ApiProperty({ enum: METHODS })
  @IsString()
  @IsIn(METHODS)
  method!: string;

  @ApiPropertyOptional({
    description: 'Headers enviados ao destino (strings)',
    example: { Accept: 'application/json' },
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Corpo JSON ou texto' })
  @IsOptional()
  body?: unknown;
}

/** Limite seguro para persistência em histórico / logs. */
export const MAX_HISTORY_JSON_CHARS = 120_000;
