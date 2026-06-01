import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma.module';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { StoredRequestsController } from './stored-requests.controller';

@Module({
  imports: [PrismaModule, UserAuthModule],
  controllers: [CollectionsController, StoredRequestsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
