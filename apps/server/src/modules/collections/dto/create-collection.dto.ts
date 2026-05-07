import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { RequestAuthDto } from '../../auth/dto/request-auth.dto';

export class CreateCollectionDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Auth predefinida para pedidos sem authConfig próprio.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestAuthDto)
  authConfig?: RequestAuthDto;
}
