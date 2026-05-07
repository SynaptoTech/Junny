import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Public SDK + Developer Platform APIs — roadmap (MD50); local-first; permissões.
 */
@ApiTags("public-api")
@Controller("api/public-api")
export class PublicApiRoadmapController {
  @Get("roadmap")
  @ApiOperation({
    summary:
      "Public SDK + developer platform APIs — stub MD50 (ecosystem futuro)",
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategicGoal: string;
    philosophy: readonly string[];
    sdkGoals: readonly string[];
    useCases: readonly string[];
    apisFuture: readonly string[];
    sdkStructure: {
      root: string;
      recommended: readonly string[];
    };
    sdkLanguagesFuture: readonly string[];
    sdkExample: string;
    publicApisFuture: readonly string[];
    pluginIntegrationFuture: readonly string[];
    cliIntegrationFuture: readonly string[];
    aiIntegrationsFuture: readonly string[];
    securityRules: readonly string[];
    authFuture: readonly string[];
    localFirst: string;
    backendLayout: {
      moduleRoot: string;
      routes: string;
      auth: string;
      sdk: string;
    };
    docsFuture: readonly string[];
    versioningFuture: readonly string[];
    enterpriseFuture: readonly string[];
    uxRequirements: readonly string[];
    notInitially: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
  } {
    return {
      phase: "roadmap",
      md: "MD50_JUNNY_PUBLIC_SDK_DEVELOPER_PLATFORM.md",
      description:
        "Roadmap estratégico para expor APIs locais e um SDK público, transformando o Junny em developer platform: automação externa, extensibilidade, tooling e ecossistema. Tudo local-first, com regras de permissões e integração futura com plugins, workflows, CLI e AI tooling.",
      strategicGoal: "plataforma developer extensível internacional",
      philosophy: ["não ser uma aplicação fechada", "developer platform"],
      sdkGoals: [
        "integração externa",
        "automação externa",
        "plugins externos",
        "tooling ecosystem",
        "extensões comunidade",
      ],
      useCases: [
        "plugins",
        "automações",
        "CLI integrations",
        "AI tooling",
        "enterprise extensions",
      ],
      apisFuture: [
        "collections",
        "requests",
        "environments",
        "workflows",
        "monitoring",
        "testing",
      ],
      sdkStructure: {
        root: "/packages/sdk",
        recommended: [
          "/packages/sdk/client",
          "/packages/sdk/types",
          "/packages/sdk/helpers",
        ],
      },
      sdkLanguagesFuture: [
        "TypeScript",
        "JavaScript",
        "Python (futuro)",
        "Go (futuro)",
      ],
      sdkExample: "const client = new JunnyClient()\n\nclient.runCollection()",
      publicApisFuture: ["local APIs", "automation APIs", "extension APIs"],
      pluginIntegrationFuture: ["Plugin System", "Marketplace", "Workflows"],
      cliIntegrationFuture: ["CLI Runtime", "terminal automation"],
      aiIntegrationsFuture: [
        "AI tooling",
        "external AI agents",
        "AI workflows",
      ],
      securityRules: [
        "respeitar permissions",
        "respeitar vault",
        "respeitar isolation",
      ],
      authFuture: ["API Tokens", "Local Auth", "Enterprise Auth (futuro)"],
      localFirst: "funcionar local-first",
      backendLayout: {
        moduleRoot: "/modules/public-api",
        routes: "/modules/public-api/routes",
        auth: "/modules/public-api/auth",
        sdk: "/modules/public-api/sdk",
      },
      docsFuture: ["SDK examples", "automation examples", "workflow examples"],
      versioningFuture: ["v1", "v2", "v3"],
      enterpriseFuture: [
        "enterprise APIs",
        "governance APIs",
        "monitoring APIs",
      ],
      uxRequirements: ["simples", "moderna", "limpa", "dark-first"],
      notInitially: [
        "cloud mandatory APIs",
        "telemetry invasiva",
        "monetização agressiva",
        "closed ecosystem",
      ],
      mvpGoals: [
        "local SDK",
        "collections APIs",
        "requests execution",
        "workflows integration",
      ],
      frontendStructure: "/features/sdk",
    };
  }
}
