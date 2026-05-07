import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { StoredRequestsController } from './stored-requests.controller';

@Module({
  controllers: [CollectionsController, StoredRequestsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
