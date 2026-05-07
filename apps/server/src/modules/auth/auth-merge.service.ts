import { BadRequestException, Injectable } from '@nestjs/common';
import type { ProxyExecuteDto } from '../rest/dto/proxy-execute.dto';
import type { RequestAuthDto } from './dto/request-auth.dto';

@Injectable()
export class AuthMergeService {
  substituteAuth(
    auth: RequestAuthDto | undefined,
    map: Record<string, string>,
  ): RequestAuthDto | undefined {
    if (!auth) return undefined;
    if (auth.type === 'none') return { ...auth, type: 'none' };
    const sub = (s?: string) =>
      s !== undefined && s !== null ? this.substitute(String(s), map) : s;
    return {
      ...auth,
      bearerToken:
        auth.bearerToken !== undefined ? sub(auth.bearerToken) : undefined,
      basicUsername:
        auth.basicUsername !== undefined ? sub(auth.basicUsername) : undefined,
      basicPassword:
        auth.basicPassword !== undefined ? sub(auth.basicPassword) : undefined,
      apiKeyValue:
        auth.apiKeyValue !== undefined ? sub(auth.apiKeyValue) : undefined,
      apiKeyName:
        auth.apiKeyName !== undefined ? sub(auth.apiKeyName) : undefined,
    };
  }

  mergeRest(
    auth: RequestAuthDto | undefined,
    headers: Record<string, string> | undefined,
    params: Record<string, string> | undefined,
  ): { headers: Record<string, string>; params: Record<string, string> } {
    const h = { ...(headers ?? {}) };
    const p = { ...(params ?? {}) };
    this.applyAuth(auth, h, p);
    return { headers: h, params: p };
  }

  /**
   * GraphQL/SOAP: REST merge sem query params; API Key em query altera o URL.
   */
  mergeUrlAndHeaders(
    url: string,
    auth: RequestAuthDto | undefined,
    headers: Record<string, string>,
  ): { url: string; headers: Record<string, string> } {
    if (
      auth?.type === 'apiKey' &&
      (auth.apiKeyAddTo ?? 'header') === 'query'
    ) {
      if (!auth.apiKeyValue?.trim()) {
        throw new BadRequestException('API key obrigatória');
      }
      const name = auth.apiKeyName?.trim() || 'api_key';
      return {
        url: this.appendQueryParam(url, name, auth.apiKeyValue),
        headers: { ...headers },
      };
    }
    const { headers: h } = this.mergeRest(auth, headers, {});
    return { url, headers: h };
  }

  redactAuth(auth: RequestAuthDto | undefined): RequestAuthDto | undefined {
    if (!auth) return undefined;
    return {
      ...auth,
      bearerToken: auth.bearerToken ? '[redacted]' : auth.bearerToken,
      basicPassword:
        auth.basicPassword !== undefined ? '[redacted]' : auth.basicPassword,
      apiKeyValue: auth.apiKeyValue ? '[redacted]' : auth.apiKeyValue,
    };
  }

  redactProxyDto(dto: ProxyExecuteDto): ProxyExecuteDto {
    return {
      ...dto,
      auth: this.redactAuth(dto.auth),
    };
  }

  private applyAuth(
    auth: RequestAuthDto | undefined,
    headers: Record<string, string>,
    params: Record<string, string>,
  ): void {
    if (!auth || auth.type === 'none') return;

    switch (auth.type) {
      case 'bearer': {
        if (!auth.bearerToken?.trim()) {
          throw new BadRequestException('Bearer token obrigatório');
        }
        headers['Authorization'] = `Bearer ${auth.bearerToken}`;
        break;
      }
      case 'basic': {
        if (!auth.basicUsername?.trim() || auth.basicPassword === undefined) {
          throw new BadRequestException(
            'Basic auth requer utilizador e palavra-passe',
          );
        }
        const b64 = Buffer.from(
          `${auth.basicUsername}:${auth.basicPassword}`,
        ).toString('base64');
        headers['Authorization'] = `Basic ${b64}`;
        break;
      }
      case 'apiKey': {
        if (!auth.apiKeyValue?.trim()) {
          throw new BadRequestException('API key obrigatória');
        }
        const addTo = auth.apiKeyAddTo ?? 'header';
        const defaultName = addTo === 'query' ? 'api_key' : 'x-api-key';
        const name = auth.apiKeyName?.trim() || defaultName;
        if (addTo === 'query') {
          params[name] = auth.apiKeyValue;
        } else {
          headers[name] = auth.apiKeyValue;
        }
        break;
      }
      default:
        break;
    }
  }

  private appendQueryParam(url: string, key: string, value: string): string {
    const u = new URL(url);
    u.searchParams.set(key, value);
    return u.toString();
  }

  private substitute(text: string, map: Record<string, string>): string {
    let out = text;
    for (const [k, v] of Object.entries(map)) {
      out = out.split(`{{${k}}}`).join(v);
    }
    return out;
  }
}
