import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly mode = signal<'login' | 'register'>('login');
  email = '';
  password = '';
  name = '';
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  toggleMode(): void {
    this.mode.update((m) => (m === 'login' ? 'register' : 'login'));
    this.error.set(null);
  }

  private safeReturnUrl(): string {
    const raw = this.route.snapshot.queryParamMap.get('returnUrl');
    if (raw && raw.startsWith('/app') && !raw.startsWith('//')) return raw;
    return '/app';
  }

  private handleError(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as {
        error?: { message?: string | string[] };
      };
      const msg = body?.error?.message;
      if (Array.isArray(msg)) {
        this.error.set(msg[0] ?? 'Erro');
        return;
      }
      if (typeof msg === 'string') {
        this.error.set(msg);
        return;
      }
    }
    this.error.set('The request could not be completed.');
  }

  submitLogin(): void {
    this.error.set(null);
    const email = this.email.trim();
    const password = this.password;
    if (!email || !password) {
      this.error.set('Enter email and password.');
      return;
    }
    this.loading.set(true);
    this.auth.login(email, password).subscribe({
      next: (payload) => {
        this.auth.finalizeSession(payload);
        this.loading.set(false);
        void this.router.navigateByUrl(this.safeReturnUrl());
      },
      error: (err) => {
        this.loading.set(false);
        this.handleError(err);
      },
    });
  }

  submitRegister(): void {
    this.error.set(null);
    const email = this.email.trim();
    const password = this.password;
    if (!email || !password) {
      this.error.set('Enter email and password.');
      return;
    }
    if (password.length < 8) {
      this.error.set('Password must be at least 8 characters.');
      return;
    }
    this.loading.set(true);
    this.auth.register(email, password, this.name.trim() || undefined).subscribe({
      next: (payload) => {
        this.auth.finalizeSession(payload);
        this.loading.set(false);
        void this.router.navigateByUrl(this.safeReturnUrl());
      },
      error: (err) => {
        this.loading.set(false);
        this.handleError(err);
      },
    });
  }
}
