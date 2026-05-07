import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  controllers: [UserAuthController],
  providers: [UserAuthService, JwtAuthGuard],
  exports: [UserAuthService, JwtAuthGuard],
})
export class UserAuthModule {}
