import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap Curl import + codegen (MD22).
 * Sem parser nem templates em execução — apenas contrato até existir MVP.
 */
@ApiTags('codegen')
@Controller('api/codegen')
export class CodegenRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Estratégia de import cURL → request e geração de snippets multi-linguagem (stub)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    uiFlowCurl: string[];
    uiFlowCodegen: string[];
    parserTargets: string[];
    languagesMvp: string[];
    backendLayout: Record<string, string>;
    frontendComponents: readonly string[];
    deferred: readonly string[];
    futureLanguages: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD22_JUNNY_CURL_IMPORT_CODEGEN.md',
      description:
        'Import de comandos curl para preencher o workspace REST e geração de snippets legíveis (fetch, HttpClient, requests, etc.) com copy-to-clipboard.',
      uiFlowCurl: ['paste-curl', 'click-import-curl', 'request-populated'],
      uiFlowCodegen: ['execute-or-select-request', 'pick-language', 'copy-snippet'],
      parserTargets: ['method', 'url', 'headers', 'body', 'auth-hints', 'query-params'],
      languagesMvp: [
        'curl',
        'javascript-fetch',
        'typescript-fetch',
        'angular-httpclient',
        'nodejs-fetch',
        'python-requests',
        'go-nethttp',
        'rust-reqwest',
        'java-httpclient',
      ],
      backendLayout: {
        module: '/modules/codegen',
        generators: '/modules/codegen/generators',
        templates: '/modules/codegen/templates',
      },
      frontendComponents: [
        'CurlImporter',
        'CurlModal',
        'CodeGenerator',
        'LanguageSelector',
        'CodeViewer',
      ],
      deferred: [
        'full-sdk-generation',
        'package-publishing',
        'ai-codegen',
        'advanced-dto-generation',
      ],
      futureLanguages: ['kotlin', 'swift', 'csharp', 'php', 'ruby', 'axios-default', 'okhttp-java'],
    };
  }
}
