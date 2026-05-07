import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RequestAuthDto } from '../../auth/dto/request-auth.dto';
import { MAX_STORED_BODY_LENGTH } from './create-stored-request.dto';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'WS'] as const;
const PROTOCOLS = ['REST', 'GRAPHQL', 'SOAP', 'WEBSOCKET'] as const;

export class UpdateStoredRequestDto {
  @ApiPropertyOptional({ enum: PROTOCOLS })
  @IsOptional()
  @IsString()
  @IsIn(PROTOCOLS)
  protocol?: 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBSOCKET';

  @ApiPropertyOptional({ enum: METHODS })
  @IsOptional()
  @IsString()
  @IsIn(METHODS)
  method?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Query params persistidos no SQLite',
  })
  @IsOptional()
  @IsObject()
  params?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Variáveis GraphQL (JSON)' })
  @IsOptional()
  @IsObject()
  graphqlVariables?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(MAX_STORED_BODY_LENGTH)
  body?: string | null;

  @ApiPropertyOptional({ description: 'Nome / rótulo na lista' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  tag?: string | null;

  @ApiPropertyOptional({
    description: 'Auth específica; omitir campo para não alterar.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestAuthDto)
  authConfig?: RequestAuthDto;
}
