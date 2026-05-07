import { Module } from "@nestjs/common";
import { PublicApiRoadmapController } from "./public-api-roadmap.controller";

@Module({
  controllers: [PublicApiRoadmapController],
})
export class PublicApiModule {}
