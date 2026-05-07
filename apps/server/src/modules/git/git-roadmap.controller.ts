import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Git Native Collections — roadmap (MD48); offline-first; dev-friendly.
 */
@ApiTags("git")
@Controller("api/git")
export class GitRoadmapController {
  @Get("roadmap")
  @ApiOperation({
    summary:
      "Git native collections · versionamento & sync — stub MD48 (operações futuras)",
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    strategicGoal: string;
    philosophy: string;
    primaryFlowSteps: readonly string[];
    plannedLayout: readonly string[];
    gitOperationsFuture: readonly string[];
    diffVisualization: readonly string[];
    plannedUiComponents: readonly string[];
    collectionsFormatFuture: string;
    gitIgnoreFuture: readonly string[];
    branchesFuture: readonly string[];
    mergeConflictsFuture: readonly string[];
    teamWorkspacesFuture: readonly string[];
    cicdFuture: readonly string[];
    uxRequirements: readonly string[];
    offlineFirst: string;
    securityFuture: readonly string[];
    enterpriseFuture: readonly string[];
    notInitially: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      repositories: string;
      sync: string;
      history: string;
    };
  } {
    return {
      phase: "roadmap",
      md: "MD48_JUNNY_GIT_NATIVE_COLLECTIONS.md",
      description:
        "Roadmap para tratar collections como código versionável: conectar repositório Git, ver status/changes, fazer commit e sincronizar — base offline-first (collections locais continuam prioridade), com arquitetura para diff visual, branches, histórico e colaboração.",
      strategicGoal: "plataforma moderna para versionamento de APIs",
      philosophy: "collections como código versionável",
      primaryFlowSteps: [
        "criar collection",
        "conectar Git repository",
        "salvar mudanças",
        "realizar commit",
        "sincronizar (pull/push)",
      ],
      plannedLayout: ["Collections", "Git Status", "Changes", "Commit History"],
      gitOperationsFuture: ["commit", "push", "pull", "fetch", "branches"],
      diffVisualization: [
        "added requests",
        "removed requests",
        "modified requests",
      ],
      plannedUiComponents: [
        "GitStatusPanel",
        "CommitViewer",
        "DiffViewer",
        "BranchSelector",
        "SyncToolbar",
      ],
      collectionsFormatFuture: "collections.json",
      gitIgnoreFuture: [
        "ignore secrets",
        "ignore local configs",
        "secure exports",
      ],
      branchesFuture: [
        "feature branches",
        "staging collections",
        "production collections",
      ],
      mergeConflictsFuture: [
        "visual merge",
        "conflict resolution",
        "collection compare",
      ],
      teamWorkspacesFuture: [
        "organizations",
        "shared repositories",
        "team collections",
      ],
      cicdFuture: [
        "collections validation",
        "testing pipelines",
        "governance flows",
      ],
      uxRequirements: [
        "extremamente simples",
        "moderna",
        "intuitiva",
        "familiar developers",
        "dark-first",
      ],
      offlineFirst: "collections locais continuam prioridade",
      securityFuture: [
        "secure auth Git",
        "SSH keys",
        "tokens",
        "private repositories",
      ],
      enterpriseFuture: [
        "private Git servers",
        "GitHub Enterprise",
        "GitLab Self Hosted",
      ],
      notInitially: [
        "distributed governance",
        "cloud mandatory sync",
        "auto push",
        "telemetry repositórios",
      ],
      mvpGoals: [
        "Git sync",
        "commit collections",
        "diff visualization",
        "local repository integration",
      ],
      frontendStructure: "/features/git",
      backendLayout: {
        moduleRoot: "/modules/git",
        repositories: "/modules/git/repositories",
        sync: "/modules/git/sync",
        history: "/modules/git/history",
      },
    };
  }
}
