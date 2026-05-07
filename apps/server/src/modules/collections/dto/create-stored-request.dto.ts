import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'WS'] as const;
const PROTOCOLS = ['REST', 'GRAPHQL', 'SOAP', 'WEBSOCKET'] as const;

/** Limite seguro para corpo persistido em SQLite. */
export const MAX_STORED_BODY_LENGTH = 500_000;

export class CreateStoredRequestDto {
  @ApiPropertyOptional({ enum: PROTOCOLS, default: 'REST' })
  @IsOptional()
  @IsString()
  @IsIn(PROTOCOLS)
  protocol?: 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBSOCKET';

  @ApiProperty({ enum: METHODS })
  @IsString()
  @IsIn(METHODS)
  method!: string;

  @ApiProperty()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;

  @ApiProperty()
  @IsObject()
  headers!: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Query params persistidos (objeto chave/valor)',
  })
  @IsOptional()
  @IsObject()
  params?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Variáveis GraphQL (JSON object)',
  })
  @IsOptional()
  @IsObject()
  graphqlVariables?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Corpo como texto (ex.: JSON)' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_STORED_BODY_LENGTH)
  body?: string | null;

  @ApiPropertyOptional({
    description:
      'Nome / rótulo na lista (sidebar). Reutiliza o campo tag no armazenamento.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  tag?: string | null;

  @ApiPropertyOptional({
    description: 'Auth específica; omite para herdar da collection.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestAuthDto)
  authConfig?: RequestAuthDto;
}
