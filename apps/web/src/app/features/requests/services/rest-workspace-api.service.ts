import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../core/environments/environment';
import type {
  RequestAuthConfig,
  RestExecuteResponse,
} from '../models/workspace.models';

export interface CollectionRow {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  authConfig?: RequestAuthConfig | null;
}

export interface StoredRequestDto {
  id: string;
  method: string;
  url: string;
  headers: unknown;
  params?: unknown;
  body: string | null;
  tag?: string | null;
  protocol?: string;
  graphqlVariables?: unknown;
  createdAt: string;
  updatedAt?: string;
  /** Efetiva (pedido ou herança da collection). */
  authConfig?: RequestAuthConfig | null;
}

export interface ImportOpenApiResult {
  environmentId: string;
  baseUrl: string;
  collections: { id: string; name: string; requestCount: number }[];
  stats: { tagCount: number; requestCount: number };
}

export interface HistoryEntryDto {
  id: string;
  request: unknown;
  response: unknown;
  status: number;
  duration: number;
  createdAt: string;
  protocol?: string;
  method?: string;
  url?: string;
}

export interface HistoryListResponse {
  items: HistoryEntryDto[];
  total: number;
  skip: number;
  take: number;
}

export interface EnvironmentDto {
  id: string;
  name: string;
  variables: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

interface Wrapped<T> {
  success: boolean;
  data: T;
  error: null;
}

@Injectable({ providedIn: 'root' })
export class RestWorkspaceApiService {
  private readonly http = inject(HttpClient);
  private readonly origin = environment.apiOrigin;
  private readonly v1 = environment.apiBaseUrl;

  executeRequest(payload: {
    method: string;
    url: string;
    headers: Record<string, string>;
    params?: Record<string, string>;
    body?: unknown;
    environmentId?: string;
    auth?: RequestAuthConfig;
  }): Observable<RestExecuteResponse> {
    return this.http.post<RestExecuteResponse>(
      `${this.origin}/api/rest/request`,
      payload,
    );
  }

  executeGraphql(payload: {
    url: string;
    query: string;
    variables?: Record<string, unknown>;
    headers?: Record<string, string>;
    environmentId?: string;
    auth?: RequestAuthConfig;
  }): Observable<RestExecuteResponse> {
    return this.http.post<RestExecuteResponse>(
      `${this.origin}/api/graphql/request`,
      payload,
    );
  }

  executeSoap(payload: {
    url: string;
    xml: string;
    headers?: Record<string, string>;
    environmentId?: string;
    auth?: RequestAuthConfig;
  }): Observable<RestExecuteResponse> {
    return this.http.post<RestExecuteResponse>(
      `${this.origin}/api/soap/request`,
      payload,
    );
  }

  listCollections(): Observable<CollectionRow[]> {
    return this.http
      .get<Wrapped<CollectionRow[]>>(`${this.v1}/collections`)
      .pipe(map((r) => r.data ?? []));
  }

  /** Collections do utilizador; cria "My requests" se a lista estiver vazia (JWT). */
  bootstrapCollections(): Observable<CollectionRow[]> {
    return this.http
      .get<Wrapped<CollectionRow[]>>(`${this.v1}/collections/bootstrap`)
      .pipe(
        map((r) => r.data ?? []),
        catchError((err: { status?: number }) =>
          err?.status === 401 ? this.listCollections() : throwError(() => err),
        ),
      );
  }

  getCollection(id: string): Observable<
    | {
        id: string;
        name: string;
        description: string | null;
        authConfig?: RequestAuthConfig | null;
        requests: StoredRequestDto[];
      }
    | undefined
  > {
    return this.http
      .get<
        Wrapped<{
          id: string;
          name: string;
          description: string | null;
          authConfig?: RequestAuthConfig | null;
          requests: StoredRequestDto[];
        }>
      >(`${this.v1}/collections/${id}`)
      .pipe(
        map((r) => r.data),
        catchError((err: { status?: number }) =>
          err?.status === 404 ? of(undefined) : throwError(() => err),
        ),
      );
  }

  createCollection(body: {
    name: string;
    description?: string;
    authConfig?: RequestAuthConfig;
  }) {
    return this.http
      .post<Wrapped<CollectionRow>>(`${this.v1}/collections`, body)
      .pipe(map((r) => r.data));
  }

  updateCollection(
    id: string,
    body: {
      name?: string;
      description?: string;
      authConfig?: RequestAuthConfig | null;
    },
  ) {
    return this.http
      .patch<Wrapped<CollectionRow>>(`${this.v1}/collections/${id}`, body)
      .pipe(map((r) => r.data));
  }

  deleteCollection(id: string) {
    return this.http
      .delete<Wrapped<unknown>>(`${this.v1}/collections/${id}`)
      .pipe(map((r) => r.data));
  }

  duplicateCollection(id: string) {
    return this.http
      .post<
        Wrapped<{
          id: string;
          name: string;
          description: string | null;
          requests: StoredRequestDto[];
        }>
      >(`${this.v1}/collections/${id}/duplicate`, {})
      .pipe(map((r) => r.data));
  }

  saveRequestToCollection(
    collectionId: string,
    body: {
      method: string;
      url: string;
      headers: Record<string, string>;
      params?: Record<string, string>;
      body?: string | null;
      tag?: string | null;
      protocol?: 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBSOCKET';
      graphqlVariables?: Record<string, unknown> | null;
      authConfig?: RequestAuthConfig;
    },
  ): Observable<StoredRequestDto> {
    return this.http
      .post<Wrapped<StoredRequestDto>>(
        `${this.v1}/collections/${collectionId}/requests`,
        body,
      )
      .pipe(map((r) => r.data!));
  }

  updateStoredRequest(
    collectionId: string,
    requestId: string,
    body: Partial<{
      method: string;
      url: string;
      headers: Record<string, string>;
      params: Record<string, string>;
      body: string | null;
      tag: string | null;
      protocol: 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBSOCKET';
      graphqlVariables: Record<string, unknown> | null;
      authConfig: RequestAuthConfig | null;
    }>,
  ) {
    return this.http
      .patch<Wrapped<unknown>>(
        `${this.v1}/collections/${collectionId}/requests/${requestId}`,
        body,
      )
      .pipe(map((r) => r.data));
  }

  deleteStoredRequest(collectionId: string, requestId: string) {
    return this.http
      .delete<Wrapped<unknown>>(
        `${this.v1}/collections/${collectionId}/requests/${requestId}`,
      )
      .pipe(map((r) => r.data));
  }

  listRootStoredRequests(): Observable<StoredRequestDto[]> {
    return this.http
      .get<Wrapped<StoredRequestDto[]>>(`${this.v1}/saved-requests`)
      .pipe(map((r) => r.data ?? []));
  }

  saveRequestToRoot(body: {
    method: string;
    url: string;
    headers: Record<string, string>;
    params?: Record<string, string>;
    body?: string | null;
    tag?: string | null;
    protocol?: 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBSOCKET';
    graphqlVariables?: Record<string, unknown> | null;
    authConfig?: RequestAuthConfig;
  }): Observable<StoredRequestDto> {
    return this.http
      .post<Wrapped<StoredRequestDto>>(`${this.v1}/saved-requests`, body)
      .pipe(map((r) => r.data!));
  }

  updateRootStoredRequest(
    requestId: string,
    body: Partial<{
      method: string;
      url: string;
      headers: Record<string, string>;
      params: Record<string, string>;
      body: string | null;
      tag: string | null;
      protocol: 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBSOCKET';
      graphqlVariables: Record<string, unknown> | null;
      authConfig: RequestAuthConfig | null;
    }>,
  ): Observable<StoredRequestDto> {
    return this.http
      .patch<Wrapped<StoredRequestDto>>(
        `${this.v1}/saved-requests/${requestId}`,
        body,
      )
      .pipe(map((r) => r.data!));
  }

  deleteRootStoredRequest(requestId: string) {
    return this.http
      .delete<Wrapped<unknown>>(`${this.v1}/saved-requests/${requestId}`)
      .pipe(map((r) => r.data));
  }

  listHistory(options?: {
    skip?: number;
    take?: number;
    q?: string;
    protocol?: string;
    method?: string;
    statusGroup?: 'any' | '2xx' | '3xx' | '4xx' | '5xx';
  }): Observable<HistoryListResponse> {
    let params = new HttpParams()
      .set('skip', String(options?.skip ?? 0))
      .set('take', String(options?.take ?? 150));
    const q = options?.q?.trim();
    if (q) params = params.set('q', q);
    if (options?.protocol?.trim())
      params = params.set('protocol', options.protocol.trim());
    if (options?.method?.trim())
      params = params.set('method', options.method.trim());
    if (options?.statusGroup && options.statusGroup !== 'any') {
      params = params.set('statusGroup', options.statusGroup);
    }
    return this.http
      .get<Wrapped<HistoryListResponse>>(`${this.v1}/history`, { params })
      .pipe(map((r) => r.data!));
  }

  deleteAllHistory(): Observable<{ deleted: number }> {
    return this.http
      .delete<Wrapped<{ deleted: number }>>(`${this.v1}/history`)
      .pipe(map((r) => r.data!));
  }

  listEnvironments(): Observable<EnvironmentDto[]> {
    return this.http
      .get<Wrapped<EnvironmentDto[]>>(`${this.v1}/environments`)
      .pipe(map((r) => r.data ?? []));
  }

  getEnvironment(id: string): Observable<EnvironmentDto> {
    return this.http
      .get<Wrapped<EnvironmentDto>>(`${this.v1}/environments/${id}`)
      .pipe(map((r) => r.data!));
  }

  createEnvironment(body: { name: string; variables?: Record<string, string> }) {
    return this.http
      .post<Wrapped<EnvironmentDto>>(`${this.v1}/environments`, body)
      .pipe(map((r) => r.data!));
  }

  updateEnvironment(
    id: string,
    body: { name?: string; variables?: Record<string, string> },
  ) {
    return this.http
      .patch<Wrapped<EnvironmentDto>>(`${this.v1}/environments/${id}`, body)
      .pipe(map((r) => r.data!));
  }

  deleteEnvironment(id: string) {
    return this.http
      .delete<Wrapped<unknown>>(`${this.v1}/environments/${id}`)
      .pipe(map((r) => r.data));
  }

  importOpenApi(body: { url: string }): Observable<ImportOpenApiResult> {
    return this.http
      .post<Wrapped<ImportOpenApiResult>>(`${this.v1}/openapi/import`, body)
      .pipe(map((r) => r.data!));
  }
}
