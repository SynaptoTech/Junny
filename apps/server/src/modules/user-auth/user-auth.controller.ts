import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserAuthService } from './user-auth.service';

@ApiTags('auth')
@Controller('v1/auth')
export class UserAuthController {
  constructor(private readonly auth: UserAuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login (JWT)' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current authenticated user' })
  async me(@Req() req: Request & { user?: { id: string } }) {
    const id = req.user?.id;
    if (!id) return null;
    const user = await this.auth.getUserById(id);
    if (!user) throw new NotFoundException();
    return user;
  }
}
