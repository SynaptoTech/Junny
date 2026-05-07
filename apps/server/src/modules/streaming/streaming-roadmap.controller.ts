import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Event Streaming Studio — roadmap (MD46); enterprise-first; realtime observability.
 */
@ApiTags("streaming")
@Controller("api/streaming")
export class StreamingRoadmapController {
  @Get("roadmap")
  @ApiOperation({
    summary:
      "Event streaming studio · Kafka debugger & realtime viewer — stub MD46 (protocols futuros)",
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategicGoal: string;
    protocolsFuture: readonly string[];
    plannedLayout: readonly string[];
    kafkaFuture: readonly string[];
    messageFields: readonly string[];
    jsonViewerFuture: readonly string[];
    filtersFuture: readonly string[];
    replayFuture: readonly string[];
    producerFuture: readonly string[];
    plannedUiComponents: readonly string[];
    monitoringIntegrationsFuture: readonly string[];
    securityFuture: readonly string[];
    enterpriseFuture: readonly string[];
    notInitially: readonly string[];
    mvpGoals: readonly string[];
    uxRequirements: readonly string[];
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      consumers: string;
      producers: string;
      inspectors: string;
    };
  } {
    return {
      phase: "roadmap",
      md: "MD46_JUNNY_EVENT_STREAMING_STUDIO.md",
      description:
        "Roadmap para um Event Streaming Studio (Kafka primeiro) com tópicos/streams, consumo em tempo real, inspeção de payload e filtros — foco enterprise e observabilidade de eventos; prepara suporte a RabbitMQ/Redis Streams/NATS e segurança (SASL/SSL).",
      strategicGoal:
        "plataforma moderna para integrações realtime event-driven",
      protocolsFuture: [
        "Kafka",
        "RabbitMQ",
        "Redis Streams",
        "NATS",
        "MQTT (futuro)",
      ],
      plannedLayout: [
        "Topics / Streams",
        "Realtime Messages",
        "Payload Inspector",
      ],
      kafkaFuture: ["brokers", "topics", "partitions", "consumers"],
      messageFields: ["payload", "timestamp", "topic", "partition", "offset"],
      jsonViewerFuture: ["JSON formatting", "syntax highlight", "search"],
      filtersFuture: ["topic", "key", "payload", "regex", "timestamp"],
      replayFuture: ["replay messages", "replay streams", "replay events"],
      producerFuture: ["send events", "publish messages", "simulate producers"],
      plannedUiComponents: [
        "TopicExplorer",
        "StreamViewer",
        "PayloadInspector",
        "EventFilters",
        "ConsumerStatus",
      ],
      monitoringIntegrationsFuture: [
        "Observability Dashboard",
        "Monitoring",
        "Performance Profiler",
      ],
      securityFuture: ["SASL", "SSL", "auth brokers", "secure connections"],
      enterpriseFuture: [
        "stream governance",
        "event analytics",
        "distributed observability",
      ],
      notInitially: [
        "distributed tracing",
        "enterprise Kafka management",
        "cloud streaming mandatory",
        "AI stream analysis",
      ],
      mvpGoals: [
        "Kafka consume",
        "realtime messages",
        "payload viewer",
        "stream filters",
      ],
      uxRequirements: [
        "extremamente visual",
        "moderna",
        "fluida",
        "profissional",
        "dark-first",
      ],
      frontendStructure: "/features/streaming",
      backendLayout: {
        moduleRoot: "/modules/streaming",
        consumers: "/modules/streaming/consumers",
        producers: "/modules/streaming/producers",
        inspectors: "/modules/streaming/inspectors",
      },
    };
  }
}
