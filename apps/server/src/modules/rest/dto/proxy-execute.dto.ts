import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RequestAuthDto } from '../../auth/dto/request-auth.dto';

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

  @ApiPropertyOptional({
    description: 'Query params (aplicados à URL antes do request)',
    example: { page: '1' },
  })
  @IsOptional()
  @IsObject()
  params?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Corpo JSON ou texto' })
  @IsOptional()
  body?: unknown;

  @ApiPropertyOptional({
    description:
      'Resolve {{variável}} na URL, headers, params e body (string) a partir do ambiente.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  environmentId?: string;

  @ApiPropertyOptional({
    description:
      'Autenticação (Bearer, Basic, API Key). Aplicada após substituição do ambiente.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestAuthDto)
  auth?: RequestAuthDto;
}

/** Limite seguro para persistência em histórico / logs. */
export const MAX_HISTORY_JSON_CHARS = 120_000;
