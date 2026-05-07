import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEnvironmentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiProperty({
    description: 'Variáveis chave/valor (strings)',
    example: { API_URL: 'https://api.example.com' },
  })
  @IsObject()
  variables!: Record<string, string>;
}
