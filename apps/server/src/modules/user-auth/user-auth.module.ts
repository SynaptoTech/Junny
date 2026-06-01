import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { IdentityModule } from '../identity/identity.module';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [PrismaModule, IdentityModule],
  controllers: [UserAuthController],
  providers: [UserAuthService, JwtAuthGuard],
  exports: [UserAuthService, JwtAuthGuard],
})
export class UserAuthModule {}
