import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class InviteWorkspaceMemberDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @ApiPropertyOptional({ enum: ['owner', 'editor', 'viewer'], default: 'viewer' })
  @IsOptional()
  @IsString()
  @IsIn(['owner', 'editor', 'viewer'])
  role?: 'owner' | 'editor' | 'viewer';
}

