import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RequestAuthDto } from '../../auth/dto/request-auth.dto';

/** Limite do documento GraphQL enviado ao endpoint. */
export const MAX_GRAPHQL_QUERY_CHARS = 500_000;

export class GraphqlExecuteDto {
  @ApiProperty({ example: 'https://api.example.com/graphql' })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;

  @ApiProperty({
    example: 'query { __typename }',
    description: 'Operação GraphQL (query/mutation)',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_GRAPHQL_QUERY_CHARS)
  query!: string;

  @ApiPropertyOptional({
    description: 'Variáveis JSON do pedido',
    example: { id: '1' },
  })
  @IsOptional()
  @IsObject()
  variables?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Cabeçalhos HTTP (ex.: Authorization)',
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiPropertyOptional({
    description:
      'Resolve {{variáveis}} em URL, query, objeto variables e headers.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  environmentId?: string;

  @ApiPropertyOptional({
    description:
      'Autenticação aplicada após substituição do ambiente (Authorization / API Key).',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestAuthDto)
  auth?: RequestAuthDto;
}
