import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'dev@junny.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'password12' })
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}
