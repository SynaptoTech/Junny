import { BadRequestException, Injectable } from '@nestjs/common';
import SwaggerParser from '@apidevtools/swagger-parser';
import axios from 'axios';
import type { OpenAPIV3 } from 'openapi-types';
import { load as yamlLoad } from 'js-yaml';
import type { Prisma } from '@prisma/client';
import { convertObj } from 'swagger2openapi';
import { PrismaService } from '../../config/prisma.service';

const HTTP_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
] as const;

const MAX_BODY_CHARS = 500_000;

@Injectable()
export class OpenApiImportService {
  constructor(private readonly prisma: PrismaService) {}

  async importFromUrl(specUrl: string) {
    const rawText = await this.fetchSpecText(specUrl);
    const parsed = this.parseSpecText(rawText);
    const api = await this.normalizeAndValidate(parsed);
    const title = sanitizeName(api.info?.title ?? 'Imported API', 180);
    const version = api.info?.version ?? '';
    const baseUrl = extractBaseUrl(api);
    const envVariables = this.buildEnvironmentVariables(api, baseUrl);
    const groups = this.groupOperationsByTag(api);

    if (groups.size === 0) {
      throw new BadRequestException('Nenhum endpoint encontrado no documento');
    }

    return this.prisma.$transaction(async (tx) => {
      const env = await tx.environment.create({
        data: {
          name: `${title} (import)`,
          variables: {
            create: Object.entries(envVariables).map(([key, value]) => ({
              key,
              value,
            })),
          },
        },
      });

      const collections: {
        id: string;
        name: string;
        requestCount: number;
      }[] = [];

      let totalRequests = 0;

      for (const [tag, requests] of groups) {
        const colName = sanitizeName(`${title} · ${tag}`, 200);
        const desc = `Import OpenAPI · ${specUrl}${version ? ` · v${version}` : ''}`;
        const created = await tx.collection.create({
          data: {
            name: colName,
            description: desc,
            requests: {
              create: requests,
            },
          },
          include: { _count: { select: { requests: true } } },
        });
        collections.push({
          id: created.id,
          name: created.name,
          requestCount: created._count.requests,
        });
        totalRequests += created._count.requests;
      }

      return {
        environmentId: env.id,
        baseUrl,
        collections,
        stats: {
          tagCount: collections.length,
          requestCount: totalRequests,
        },
      };
    });
  }

  private async fetchSpecText(url: string): Promise<string> {
    try {
      const res = await axios.get<string>(url, {
        timeout: 120_000,
        maxContentLength: 50 * 1024 * 1024,
        maxBodyLength: 50 * 1024 * 1024,
        validateStatus: (s) => s >= 200 && s < 400,
        headers: {
          Accept: 'application/json, application/yaml, text/yaml, */*',
        },
        responseType: 'text',
        transformResponse: (r) => r,
      });
      return String(res.data ?? '').replace(/^\uFEFF/, '');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new BadRequestException(`Não foi possível obter a URL: ${msg}`);
    }
  }

  private parseSpecText(text: string): unknown {
    const t = text.trim();
    if (!t) throw new BadRequestException('Documento vazio');
    try {
      return JSON.parse(t) as unknown;
    } catch {
      try {
        return yamlLoad(t) as unknown;
      } catch {
        throw new BadRequestException('JSON ou YAML inválido');
      }
    }
  }

  private async normalizeAndValidate(spec: unknown): Promise<OpenAPIV3.Document> {
    const obj = spec as Record<string, unknown>;
    try {
      if (obj.swagger === '2.0') {
        const opts: Record<string, unknown> = { warnOnly: true, source: 'upload' };
        await convertObj(spec, opts);
        const openapi = (opts as { openapi?: OpenAPIV3.Document }).openapi;
        if (!openapi) {
          throw new BadRequestException('Falha ao converter Swagger 2.0');
        }
        return (await SwaggerParser.validate(openapi)) as OpenAPIV3.Document;
      }
      if (
        typeof obj.openapi === 'string' &&
        obj.openapi.startsWith('3.')
      ) {
        return (await SwaggerParser.validate(
          spec as OpenAPIV3.Document,
        )) as OpenAPIV3.Document;
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      const msg = err instanceof Error ? err.message : String(err);
      throw new BadRequestException(`Documento OpenAPI inválido: ${msg}`);
    }
    throw new BadRequestException(
      'Formato não suportado (use OpenAPI 3.x ou Swagger 2.0)',
    );
  }

  private buildEnvironmentVariables(
    api: OpenAPIV3.Document,
    baseUrl: string,
  ): Record<string, string> {
    const vars: Record<string, string> = {
      baseUrl: baseUrl.replace(/\/$/, ''),
    };
    const schemes = api.components?.securitySchemes ?? {};
    for (const scheme of Object.values(schemes)) {
      if (!scheme || typeof scheme !== 'object' || '$ref' in scheme) continue;
      const s = scheme as OpenAPIV3.SecuritySchemeObject;
      if (s.type === 'http' && s.scheme?.toLowerCase() === 'bearer') {
        vars['token'] = '';
      } else if (s.type === 'http' && s.scheme?.toLowerCase() === 'basic') {
        vars['basicAuth'] = '';
      } else if (s.type === 'apiKey' && s.in === 'header' && s.name) {
        const k = sanitizeEnvKey(s.name);
        if (!vars[k]) vars[k] = '';
      }
    }
    return vars;
  }

  private groupOperationsByTag(
    api: OpenAPIV3.Document,
  ): Map<string, Prisma.StoredRequestCreateWithoutCollectionInput[]> {
    const map = new Map<
      string,
      Prisma.StoredRequestCreateWithoutCollectionInput[]
    >();

    const paths = api.paths ?? {};
    for (const [pathKey, pathItem] of Object.entries(paths)) {
      if (!pathItem || typeof pathItem !== 'object') continue;
      const item = pathItem as OpenAPIV3.PathItemObject;
      for (const method of HTTP_METHODS) {
        const op = item[method];
        if (!op || typeof op !== 'object') continue;
        const operation = op as OpenAPIV3.OperationObject;
        const tags =
          operation.tags?.filter(Boolean).length && operation.tags
            ? operation.tags
            : ['General'];
        const tag = sanitizeName(tags[0]!, 80);
        const row = this.buildStoredRequest(
          api,
          method.toUpperCase(),
          pathKey,
          item,
          operation,
          tag,
        );
        const list = map.get(tag) ?? [];
        list.push(row);
        map.set(tag, list);
      }
    }
    return map;
  }

  private buildStoredRequest(
    api: OpenAPIV3.Document,
    method: string,
    pathTemplate: string,
    pathItem: OpenAPIV3.PathItemObject,
    operation: OpenAPIV3.OperationObject,
    tag: string,
  ): Prisma.StoredRequestCreateWithoutCollectionInput {
    const params = mergeParameters(pathItem, operation);
    const pathPart = pathTemplate.startsWith('/')
      ? pathTemplate
      : `/${pathTemplate}`;
    const urlPath = pathPart.replace(/\{([^}]+)\}/g, '{{$1}}');
    const url = `{{baseUrl}}${urlPath}`;

    const query: Record<string, string> = {};
    const headerParams: Record<string, string> = {};
    for (const p of params) {
      if (p.in === 'query') {
        const ex = paramExample(p);
        query[p.name] = ex !== '' ? ex : '';
      } else if (p.in === 'header') {
        const ex = paramExample(p);
        headerParams[p.name] =
          ex !== '' ? ex : `{{${sanitizeEnvKey(p.name)}}}`;
      }
    }

    const secHeaders = resolveSecurityHeaders(api, operation);
    const headers: Record<string, string> = { ...secHeaders, ...headerParams };

    const bodyStr = pickRequestBodyString(operation.requestBody);
    if (bodyStr !== null) {
      headers['Content-Type'] =
        headers['Content-Type'] ?? 'application/json';
    }

    const body =
      bodyStr !== null ? truncate(bodyStr, MAX_BODY_CHARS) : null;

    return {
      method,
      url,
      headers: headers as Prisma.InputJsonValue,
      params: query as Prisma.InputJsonValue,
      body,
      tag,
    };
  }
}

function extractBaseUrl(api: OpenAPIV3.Document): string {
  const s = api.servers?.[0]?.url;
  if (s) return s.replace(/\/$/, '');
  return 'https://example.com';
}

function mergeParameters(
  pathItem: OpenAPIV3.PathItemObject,
  operation: OpenAPIV3.OperationObject,
): OpenAPIV3.ParameterObject[] {
  const raw = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])];
  const out: OpenAPIV3.ParameterObject[] = [];
  for (const p of raw) {
    if (!p || typeof p !== 'object' || '$ref' in p) continue;
    out.push(p as OpenAPIV3.ParameterObject);
  }
  return out;
}

function paramExample(p: OpenAPIV3.ParameterObject): string {
  if ('example' in p && p.example !== undefined && p.example !== null) {
    return String(p.example);
  }
  const schema = 'schema' in p ? p.schema : undefined;
  if (
    schema &&
    typeof schema === 'object' &&
    !('$ref' in schema) &&
    'example' in schema &&
    (schema as { example?: unknown }).example !== undefined
  ) {
    return String((schema as { example: unknown }).example);
  }
  return '';
}

function resolveSecurityHeaders(
  api: OpenAPIV3.Document,
  operation: OpenAPIV3.OperationObject,
): Record<string, string> {
  const schemes = api.components?.securitySchemes ?? {};
  const requirements =
    operation.security ?? api.security ?? ([] as OpenAPIV3.SecurityRequirementObject[]);
  const headers: Record<string, string> = {};
  if (!requirements?.length) return headers;
  const req = requirements[0];
  if (!req) return headers;
  for (const [schemeName] of Object.entries(req)) {
    const scheme = schemes[schemeName];
    if (!scheme || typeof scheme !== 'object' || '$ref' in scheme) continue;
    const s = scheme as OpenAPIV3.SecuritySchemeObject;
    if (s.type === 'http') {
      if (s.scheme?.toLowerCase() === 'bearer') {
        headers['Authorization'] = 'Bearer {{token}}';
      } else if (s.scheme?.toLowerCase() === 'basic') {
        headers['Authorization'] = 'Basic {{basicAuth}}';
      }
    } else if (s.type === 'apiKey' && s.in === 'header' && s.name) {
      const k = sanitizeEnvKey(s.name);
      headers[s.name] = `{{${k}}}`;
    }
  }
  return headers;
}

function pickRequestBodyString(
  body: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject | undefined,
): string | null {
  if (!body || typeof body !== 'object' || '$ref' in body) return null;
  const req = body as OpenAPIV3.RequestBodyObject;
  if (!req.content) return null;
  const json = req.content['application/json'];
  const media = json ?? Object.values(req.content)[0];
  if (!media) return null;
  if (media.example !== undefined) {
    return stringifyBodyExample(media.example);
  }
  if (media.examples) {
    const first = Object.values(media.examples)[0];
    if (first && typeof first === 'object' && 'value' in first && first.value !== undefined) {
      return stringifyBodyExample(first.value);
    }
  }
  const schema = media.schema;
  if (
    schema &&
    typeof schema === 'object' &&
    !('$ref' in schema) &&
    'example' in schema &&
    (schema as { example?: unknown }).example !== undefined
  ) {
    return stringifyBodyExample((schema as { example: unknown }).example);
  }
  return '{}';
}

function stringifyBodyExample(value: unknown): string {
  if (value === undefined || value === null) return '{}';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{}';
  }
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}\n…`;
}

function sanitizeName(name: string, max: number): string {
  const cleaned = name.replace(/[\x00-\x1f]/g, '').trim() || 'Untitled';
  return cleaned.length > max ? cleaned.slice(0, max - 1) + '…' : cleaned;
}

function sanitizeEnvKey(name: string): string {
  const k = name.replace(/[^a-zA-Z0-9_]/g, '_');
  return k || 'apiKey';
}
