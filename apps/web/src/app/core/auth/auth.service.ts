import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

type AuthPayload = {
  accessToken: string;
  user: AuthUser;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

const TOKEN_KEY = 'junny.auth.token';
const USER_KEY = 'junny.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly api = `${environment.apiBaseUrl}/auth`;

  readonly accessToken = signal<string | null>(null);
  readonly currentUser = signal<AuthUser | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessToken());

  constructor() {
    if (this.storageAvailable()) {
      try {
        const t = localStorage.getItem(TOKEN_KEY);
        const u = localStorage.getItem(USER_KEY);
        if (t) this.accessToken.set(t);
        if (u) this.currentUser.set(JSON.parse(u) as AuthUser);
      } catch {
        this.clearSession();
      }
    }
  }

  private storageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private persistSession(payload: AuthPayload): void {
    this.accessToken.set(payload.accessToken);
    this.currentUser.set(payload.user);
    if (this.storageAvailable()) {
      localStorage.setItem(TOKEN_KEY, payload.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    }
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    if (this.storageAvailable()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  login(email: string, password: string): Observable<AuthPayload> {
    return this.http
      .post<ApiSuccess<AuthPayload>>(`${this.api}/login`, {
        email,
        password,
      })
      .pipe(map((r) => r.data));
  }

  register(
    email: string,
    password: string,
    name?: string,
  ): Observable<AuthPayload> {
    return this.http
      .post<ApiSuccess<AuthPayload>>(`${this.api}/register`, {
        email,
        password,
        name: name?.trim() || undefined,
      })
      .pipe(map((r) => r.data));
  }

  finalizeSession(payload: AuthPayload): void {
    this.persistSession(payload);
  }

  /** Valida o JWT contra o servidor e atualiza o perfil. */
  refreshProfile(): Observable<AuthUser | null> {
    const token = this.accessToken();
    if (!token) {
      this.clearSession();
      return of(null);
    }
    return this.http.get<ApiSuccess<AuthUser>>(`${this.api}/me`).pipe(
      map((r) => r.data),
      tap((u) => {
        if (u && this.storageAvailable()) {
          this.currentUser.set(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        }
      }),
    );
  }

  logout(navigateToLogin = true): void {
    this.clearSession();
    if (navigateToLogin) void this.router.navigate(['/login']);
  }
}
