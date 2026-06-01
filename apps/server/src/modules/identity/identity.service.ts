import {
  ConflictException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { identityConfig } from './identity.config';

export type IdentityRegisterResult = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: { id: string; email: string; name: string | null };
};

@Injectable()
export class IdentityService {
  private readonly log = new Logger(IdentityService.name);

  isEnabled(): boolean {
    return identityConfig.enabled && !!identityConfig.clientSecret;
  }

  async register(params: {
    email: string;
    password: string;
    name?: string;
  }): Promise<IdentityRegisterResult> {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Synapto Identity não está configurado.');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), identityConfig.timeoutMs);

    try {
      const res = await fetch(`${identityConfig.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': identityConfig.clientId,
          'X-Integration-Secret': identityConfig.clientSecret,
        },
        body: JSON.stringify({
          email: params.email,
          password: params.password,
          name: params.name,
          client: identityConfig.clientId,
          tenantSlug: identityConfig.tenantSlug,
        }),
        signal: controller.signal,
      });

      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      const message =
        typeof body.message === 'string'
          ? body.message
          : 'Não foi possível concluir o cadastro.';

      if (res.status === 409 || body.error === 'EMAIL_ALREADY_REGISTERED') {
        throw new ConflictException('This email is already registered.');
      }
      if (!res.ok) {
        this.log.warn(`Identity register ${res.status}: ${message}`);
        throw new UnauthorizedException(message);
      }

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
    } catch (err) {
      if (err instanceof ConflictException || err instanceof UnauthorizedException) {
        throw err;
      }
      if ((err as Error).name === 'AbortError') {
        throw new ServiceUnavailableException('Synapto Identity demorou a responder.');
      }
      this.log.error(`Identity register failed: ${(err as Error).message}`);
      throw new ServiceUnavailableException('Não foi possível contactar o Synapto Identity.');
    } finally {
      clearTimeout(timer);
    }
  }
}
