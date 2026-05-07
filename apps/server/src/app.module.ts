import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./config/prisma.module";
import { AiModule } from "./modules/ai/ai.module";
import { CodegenModule } from "./modules/codegen/codegen.module";
import { CollectionsModule } from "./modules/collections/collections.module";
import { EnvironmentsModule } from "./modules/environments/environments.module";
import { GraphqlModule } from "./modules/graphql/graphql.module";
import { GrpcModule } from "./modules/grpc/grpc.module";
import { DesignSystemModule } from "./modules/design-system/design-system.module";
import { KafkaModule } from "./modules/kafka/kafka.module";
import { MockModule } from "./modules/mock/mock.module";
import { HistoryModule } from "./modules/history/history.module";
import { OpenApiModule } from "./modules/openapi/openapi.module";
import { PluginsModule } from "./modules/plugins/plugins.module";
import { RestModule } from "./modules/rest/rest.module";
import { RunnerModule } from "./modules/runner/runner.module";
import { SecurityModule } from "./modules/security/security.module";
import { SyncModule } from "./modules/sync/sync.module";
import { SoapModule } from "./modules/soap/soap.module";
import { WebSocketModule } from "./modules/websocket/websocket.module";
import { WsModule } from "./modules/ws/ws.module";
import { WorkspaceLayoutModule } from "./modules/workspace-layout/workspace-layout.module";
import { DesktopModule } from "./modules/desktop/desktop.module";
import { TeamModule } from "./modules/team/team.module";
import { OfficialModule } from "./modules/official/official.module";
import { MonitoringModule } from "./modules/monitoring/monitoring.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { DiffModule } from "./modules/diff/diff.module";
import { InterceptorModule } from "./modules/interceptor/interceptor.module";
import { BrowserExtensionModule } from "./modules/browser-extension/browser-extension.module";
import { AiGeneratorModule } from "./modules/ai-generator/ai-generator.module";
import { AiAnalyzerModule } from "./modules/ai-analyzer/ai-analyzer.module";
import { WorkflowsModule } from "./modules/workflows/workflows.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";
import { EnterpriseModule } from "./modules/enterprise/enterprise.module";
import { ProfilerModule } from "./modules/profiler/profiler.module";
import { ObservabilityModule } from "./modules/observability/observability.module";
import { VaultModule } from "./modules/vault/vault.module";
import { AiDocsModule } from "./modules/ai-docs/ai-docs.module";
import { AiOpenapiModule } from "./modules/ai-openapi/ai-openapi.module";
import { StreamingModule } from "./modules/streaming/streaming.module";
import { GitModule } from "./modules/git/git.module";
import { PublicApiModule } from "./modules/public-api/public-api.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RestModule,
    SoapModule,
    GraphqlModule,
    GrpcModule,
    HistoryModule,
    CollectionsModule,
    CodegenModule,
    RunnerModule,
    MockModule,
    SecurityModule,
    SyncModule,
    WorkspaceLayoutModule,
    DesktopModule,
    TeamModule,
    OfficialModule,
    MonitoringModule,
    ContractsModule,
    DiffModule,
    InterceptorModule,
    BrowserExtensionModule,
    AiGeneratorModule,
    AiAnalyzerModule,
    WorkflowsModule,
    MarketplaceModule,
    EnterpriseModule,
    ProfilerModule,
    ObservabilityModule,
    VaultModule,
    AiDocsModule,
    AiOpenapiModule,
    StreamingModule,
    GitModule,
    PublicApiModule,
    EnvironmentsModule,
    OpenApiModule,
    WsModule,
    WebSocketModule,
    KafkaModule,
    DesignSystemModule,
    PluginsModule,
    AiModule,
  ],
})
export class AppModule {}
