import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Enterprise Secrets Vault — roadmap (MD43); local/offline-first; sem cloud obrigatória no MVP.
 */
@ApiTags('vault')
@Controller('api/vault')
export class VaultRoadmapController {
  @Get('roadmap')
  @ApiOperation({
    summary:
      'Cofre enterprise de secrets — stub MD43 (crypto & storage futuros)',
  })
  roadmap(): {
    phase: string;
    md: string;
    description: string;
    principles: readonly string[];
    strategicGoals: readonly string[];
    useCases: readonly string[];
    secretTypesFuture: readonly string[];
    visualStackPlanned: readonly string[];
    categoriesFuture: readonly string[];
    encryptionFuture: readonly string[];
    secureStorageFuture: readonly string[];
    accessControlFuture: readonly string[];
    auditLogsFuture: readonly string[];
    teamIntegrationFuture: readonly string[];
    securityGoals: readonly string[];
    uxRequirements: readonly string[];
    plannedUiComponents: readonly string[];
    enterpriseFuture: readonly string[];
    futureThemes: readonly string[];
    deferred: readonly string[];
    mvpGoals: readonly string[];
    frontendStructure: string;
    backendLayout: {
      moduleRoot: string;
      crypto: string;
      storage: string;
      permissions: string;
    };
  } {
    return {
      phase: 'roadmap',
      md: 'MD43_JUNNY_SECRETS_VAULT_ENTERPRISE.md',
      description:
        'Roadmap para cofre corporativo coexistente com a linha local-first: encrypt em repouso, storage seguro desktop (Keychain/Secure Enclave, TPM quando existir runtime), masking e governança de credenciais (API keys, bearer, OAuth, certificados) — RBAC/permissões, auditoria de acesso e segregação workspace — sem vault distribuído, cloud obrigatória nem telemetria sobre segredos no arranque.',
      principles: [
        'local-first mesmo em modo vault enterprise',
        'minimize-exposure-and-sensitive-logs',
        'coexistência-com-opensource-junny',
      ],
      strategicGoals: [
        'plataforma de integrações enterprise com cofre soberano de credenciais',
        'governança e audit trail sem sacrificar ergonomia quotidiana',
        'offline-first sustentado mesmo com camadas encrypt',
      ],
      useCases: [
        'enterprise APIs com segregação forte',
        'fintech, banking, healthcare e ambientes regulatoriamente tensos',
        'equipa DevOps garantindo segregation of duties sobre secrets',
      ],
      secretTypesFuture: [
        'API Keys',
        'Bearer Tokens',
        'Passwords',
        'OAuth Tokens',
        'Certificates',
        'Private Keys',
      ],
      visualStackPlanned: ['Vault Explorer', 'Secret Details', 'Permissions'],
      categoriesFuture: ['Development', 'Staging', 'Production', 'Shared', 'Private'],
      encryptionFuture: ['AES encryption layers', 'secure local encryption', 'runtime decryption gated'],
      secureStorageFuture: ['OS Keychain', 'Secure Enclave', 'TPM futuro'],
      accessControlFuture: ['RBAC', 'secret permissions', 'workspace isolation'],
      auditLogsFuture: ['secret access', 'modifications', 'usage tracking'],
      teamIntegrationFuture: ['shared secrets', 'team vaults', 'organization secrets'],
      securityGoals: [
        'minimizar exposição de segredos em memória/logs',
        'clipboard protection & timeouts (fases futuras)',
        'evitar fugas através de UI',
      ],
      uxRequirements: ['moderna', 'simples', 'extremamente segura perceptível', 'intuitiva dark-first'],
      plannedUiComponents: [
        'VaultExplorer',
        'SecretViewer',
        'SecretEditor',
        'PermissionsPanel',
        'VaultSettings',
      ],
      enterpriseFuture: [
        'HSM integration',
        'external vault adapters',
        'HashiCorp Vault futuro',
        'cloud vaults opcionais',
      ],
      futureThemes: [
        'biometric unlock',
        'automated credential policies',
        'secret rotation',
        'integrations com corporativos KMS',
      ],
      deferred: [
        'distributed vault obrigatório',
        'cloud vault exclusivo para operar',
        'sharing público de segredos',
        'telemetry de credenciais',
      ],
      mvpGoals: [
        'encrypted secrets',
        'secure storage',
        'local vault',
        'secret masking',
      ],
      frontendStructure: '/features/vault',
      backendLayout: {
        moduleRoot: '/modules/vault',
        crypto: '/modules/vault/crypto',
        storage: '/modules/vault/storage',
        permissions: '/modules/vault/permissions',
      },
    };
  }
}
