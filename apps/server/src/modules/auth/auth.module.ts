import { Module } from '@nestjs/common';
import { AuthMergeService } from './auth-merge.service';

@Module({
  providers: [AuthMergeService],
  exports: [AuthMergeService],
})
export class AuthModule {}
