import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { RequestAuthDto } from '../../auth/dto/request-auth.dto';

export class UpdateCollectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Substituir auth predefinida; null remove.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestAuthDto)
  authConfig?: RequestAuthDto | null;
}
