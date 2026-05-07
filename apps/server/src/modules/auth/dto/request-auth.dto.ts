import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const AUTH_TYPES = ['none', 'bearer', 'basic', 'apiKey'] as const;
export type AuthType = (typeof AUTH_TYPES)[number];

export class RequestAuthDto {
  @ApiProperty({ enum: AUTH_TYPES })
  @IsString()
  @IsIn(AUTH_TYPES)
  type!: AuthType;

  @ApiPropertyOptional({ description: 'Bearer token (suporta {{var}} do ambiente)' })
  @IsOptional()
  @IsString()
  @MaxLength(8192)
  bearerToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  basicUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8192)
  basicPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8192)
  apiKeyValue?: string;

  @ApiPropertyOptional({ enum: ['header', 'query'] })
  @IsOptional()
  @IsString()
  @IsIn(['header', 'query'])
  apiKeyAddTo?: 'header' | 'query';

  @ApiPropertyOptional({
    description: 'Nome do header ou query param (default: x-api-key / api_key)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  apiKeyName?: string;
}
