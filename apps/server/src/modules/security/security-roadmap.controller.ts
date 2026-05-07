import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Roadmap de segurança e gestão de secrets (MD25).
 * Sem vault real nem keychain — só contrato arquitetural e MVP planejado.
 */
@ApiTags('security')
@Controller('api/security')
export class SecurityRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Privacy-first, secrets locais, masking UX e sanitização de logs (stub)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    secretCategories: readonly string[];
    mvpCapabilities: string[];
    backendLayout: Record<string, string>;
    uxSecrets: readonly string[];
    logRules: readonly string[];
    sanitizationHeaders: readonly string[];
    deferred: readonly string[];
    futureFeatures: readonly string[];
  } {
    return {
      phase: 'roadmap',
      md: 'MD25_JUNNY_SECURITY_SECRETS_ARCHITECTURE.md',
      description:
        'Prioridade desde o início: tokens, API keys e ambientes ficam locais; sem cloud obrigatória; masking, revelação controlada e pedidos/logs sem credenciais em claro.',
      principles: [
        'privacy-first',
        'local-by-default',
        'offline-first',
        'zero-invasive-telemetry-initially',
        'open-source-trust',
      ],
      secretCategories: [
        'bearer-tokens',
        'api-keys',
        'passwords',
        'oauth-tokens-future',
        'certificates-future',
      ],
      mvpCapabilities: [
        'local-storage-sqlite-no-auto-sync',
        'masking-secrets-ux',
        'authorization-header-sanitization-logs',
        'dto-validation-backend',
        'secure-auth-handling',
      ],
      backendLayout: {
        module: '/modules/security',
        vault: '/modules/security/vault',
        crypto: '/modules/security/crypto',
        auth: '/modules/security/auth',
      },
      uxSecrets: ['masked-by-default', 'show-hide-toggle', 'copy-with-care'],
      logRules: ['never-log-passwords-tokens-keys', 'sanitize-request-history'],
      sanitizationHeaders: ['Authorization'],
      deferred: [
        'cloud-mandatory-auth',
        'invasive-telemetry',
        'automatic-sync',
        'secret-sharing',
      ],
      futureFeatures: [
        'aes-local-encryption-runtime-decrypt',
        'os-keychain-vault',
        'privacy-mode-ai-telemetry-off',
        'clipboard-timeout-clear',
        'mtls-custom-certs',
      ],
    };
  }
}
