import {
  ConflictException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { identityConfig } from './identity.config';

export type IdentityAuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type IdentityAuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: IdentityAuthUser;
};

type IdentityJson = Record<string, unknown>;

@Injectable()
export class IdentityService {
  private readonly log = new Logger(IdentityService.name);

  isEnabled(): boolean {
    return identityConfig.enabled && !!identityConfig.clientSecret;
  }

  private integrationHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Client-Id': identityConfig.clientId,
      'X-Integration-Secret': identityConfig.clientSecret,
    };
  }

  private async request(
    path: string,
    init: RequestInit,
  ): Promise<{ res: Response; body: IdentityJson }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), identityConfig.timeoutMs);
    try {
      const res = await fetch(`${identityConfig.apiUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          ...this.integrationHeaders(),
          ...(init.headers as Record<string, string> | undefined),
        },
      });
      const body = (await res.json().catch(() => ({}))) as IdentityJson;
      return { res, body };
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new ServiceUnavailableException('Synapto Identity demorou a responder.');
      }
      this.log.error(`Identity ${path} failed: ${(err as Error).message}`);
      throw new ServiceUnavailableException('Não foi possível contactar o Synapto Identity.');
    } finally {
      clearTimeout(timer);
    }
  }

  private messageFrom(body: IdentityJson, fallback: string): string {
    const msg = body.message;
    if (typeof msg === 'string' && msg.trim()) return msg;
    return fallback;
  }

  private toSession(body: IdentityJson): IdentityAuthSession {
    const user = body.user as { id?: string; email?: string; name?: string } | undefined;
    const accessToken = typeof body.accessToken === 'string' ? body.accessToken : '';
    if (!accessToken || !user?.id || !user.email) {
      throw new ServiceUnavailableException('Resposta inválida do Synapto Identity.');
    }
    return {
      accessToken,
      refreshToken: typeof body.refreshToken === 'string' ? body.refreshToken : undefined,
      expiresIn: typeof body.expiresIn === 'number' ? body.expiresIn : undefined,
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
      },
    };
  }

  private async finishAuthFlow(body: IdentityJson): Promise<IdentityAuthSession> {
    const status = typeof body.status === 'string' ? body.status : '';

    if (status === 'AUTHENTICATED') {
      return this.toSession(body);
    }

    if (status === 'TENANT_SELECTION_REQUIRED') {
      const pendingToken = typeof body.pendingToken === 'string' ? body.pendingToken : '';
      const tenants = Array.isArray(body.tenants)
        ? (body.tenants as Array<{ id?: string; slug?: string }>)
        : [];
      if (!pendingToken || !tenants.length) {
        throw new ServiceUnavailableException('Identity: seleção de tenant inválida.');
      }
      const slug = identityConfig.tenantSlug;
      const picked =
        (slug && tenants.find((t) => t.slug === slug)) ||
        tenants[0];
      if (!picked?.id) {
        throw new UnauthorizedException(
          slug
            ? `Tenant "${slug}" não disponível para este utilizador.`
            : 'Nenhum tenant disponível.',
        );
      }
      return this.selectTenant(pendingToken, picked.id);
    }

    if (status === 'MFA_REQUIRED') {
      throw new UnauthorizedException(
        'MFA obrigatório nesta conta. Conclua o login em identity.synapto.com.br ou desative MFA para API.',
      );
    }

    throw new ServiceUnavailableException('Resposta inesperada do Synapto Identity.');
  }

  async register(params: {
    email: string;
    password: string;
    name?: string;
  }): Promise<IdentityAuthSession> {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Synapto Identity não está configurado.');
    }

    const { res, body } = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        name: params.name,
        client: identityConfig.clientId,
        tenantSlug: identityConfig.tenantSlug,
      }),
    });

    if (res.status === 409 || body.error === 'EMAIL_ALREADY_REGISTERED') {
      throw new ConflictException('This email is already registered.');
    }
    if (!res.ok) {
      this.log.warn(`Identity register ${res.status}: ${this.messageFrom(body, 'register failed')}`);
      throw new UnauthorizedException(this.messageFrom(body, 'Não foi possível concluir o cadastro.'));
    }

    return this.finishAuthFlow(body);
  }

  async login(params: { email: string; password: string }): Promise<IdentityAuthSession> {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Synapto Identity não está configurado.');
    }

    const { res, body } = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        client: identityConfig.clientId,
        redirect: '/',
      }),
    });

    if (!res.ok) {
      const code = typeof body.error === 'string' ? body.error : '';
      if (code === 'INVALID_CREDENTIALS' || res.status === 401) {
        throw new UnauthorizedException('Invalid email or password.');
      }
      this.log.warn(`Identity login ${res.status}: ${this.messageFrom(body, 'login failed')}`);
      throw new UnauthorizedException(this.messageFrom(body, 'Não foi possível iniciar sessão.'));
    }

    return this.finishAuthFlow(body);
  }

  private async selectTenant(
    pendingToken: string,
    tenantId: string,
  ): Promise<IdentityAuthSession> {
    const { res, body } = await this.request('/auth/select-tenant', {
      method: 'POST',
      body: JSON.stringify({ pendingToken, tenantId }),
    });

    if (!res.ok) {
      throw new UnauthorizedException(
        this.messageFrom(body, 'Não foi possível selecionar o tenant.'),
      );
    }

    return this.finishAuthFlow(body);
  }
}
