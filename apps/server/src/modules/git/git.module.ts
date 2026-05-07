import { Module } from "@nestjs/common";
import { GitRoadmapController } from "./git-roadmap.controller";

@Module({
  controllers: [GitRoadmapController],
})
export class GitModule {}
