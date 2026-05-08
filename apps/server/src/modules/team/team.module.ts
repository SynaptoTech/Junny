import { Module } from '@nestjs/common';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { TeamRoadmapController } from './team-roadmap.controller';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

@Module({
  imports: [UserAuthModule],
  controllers: [TeamRoadmapController, WorkspacesController],
  providers: [WorkspacesService],
})
export class TeamModule {}
