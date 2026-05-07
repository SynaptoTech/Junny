import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEnvironmentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({
    description: 'Variáveis chave/valor (strings)',
    example: { baseUrl: 'https://api.example.com' },
    default: {},
  })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;
}
