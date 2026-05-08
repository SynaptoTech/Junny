import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AcceptWorkspaceInviteDto {
  @ApiProperty({ description: 'Token do convite' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  token!: string;
}

