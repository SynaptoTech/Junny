import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { environment } from '../../../core/environments/environment';

interface Wrapped<T> {
  success?: boolean;
  data?: T;
  error?: unknown;
}

export type WorkspaceRole = 'owner' | 'editor' | 'viewer';

export interface WorkspaceDto {
  id: string;
  name: string;
  role: WorkspaceRole;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberDto {
  id: string;
  role: WorkspaceRole;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
}

@Injectable({ providedIn: 'root' })
export class TeamApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  listMyWorkspaces(): Observable<WorkspaceDto[]> {
    return this.http.get<WorkspaceDto[] | Wrapped<WorkspaceDto[]>>(
      `${this.base}/workspaces`,
    ).pipe(map((r) => (Array.isArray(r) ? r : (r.data ?? []))));
  }

  createWorkspace(name: string): Observable<WorkspaceDto> {
    return this.http.post<WorkspaceDto | Wrapped<WorkspaceDto>>(
      `${this.base}/workspaces`,
      { name },
    ).pipe(map((r) => ('id' in (r as any) ? (r as WorkspaceDto) : (r as Wrapped<WorkspaceDto>).data!)));
  }

  listMembers(workspaceId: string): Observable<WorkspaceMemberDto[]> {
    return this.http.get<WorkspaceMemberDto[] | Wrapped<WorkspaceMemberDto[]>>(
      `${this.base}/workspaces/${workspaceId}/members`,
    ).pipe(map((r) => (Array.isArray(r) ? r : (r.data ?? []))));
  }

  invite(workspaceId: string, email: string, role: WorkspaceRole): Observable<any> {
    return this.http.post(
      `${this.base}/workspaces/${workspaceId}/invites`,
      { email, role },
    );
  }

  acceptInvite(token: string): Observable<any> {
    return this.http.post(`${this.base}/workspaces/invites/accept`, { token });
  }
}

