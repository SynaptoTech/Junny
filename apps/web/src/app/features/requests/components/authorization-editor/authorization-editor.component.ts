import { Component, input, output } from '@angular/core';
import type {
  AuthType,
  RequestAuthConfig,
} from '../../models/workspace.models';

@Component({
  selector: 'app-authorization-editor',
  standalone: true,
  template: `
    <div class="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
      <div class="border-b border-white/5 px-3 py-2">
        <span class="text-xs font-medium text-slate-400">Authorization</span>
      </div>
      <div class="space-y-3 p-3">
        <div>
          <label class="mb-1 block text-xs text-slate-500" for="auth-type"
            >Tipo</label
          >
          <select
            id="auth-type"
            class="w-full max-w-xs rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            [value]="auth().type"
            (change)="setType($any($event.target).value)"
          >
            <option value="none">No Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="basic">Basic Auth</option>
            <option value="apiKey">API Key</option>
          </select>
        </div>
        @switch (auth().type) {
          @case ('bearer') {
            <div>
              <label
                class="mb-1 block text-xs text-slate-500"
                for="auth-bearer"
                >Token</label
              >
              <input
                id="auth-bearer"
                type="password"
                class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100"
                [value]="auth().bearerToken ?? ''"
                (input)="patch({ bearerToken: $any($event.target).value })"
                [attr.placeholder]="phToken"
                autocomplete="off"
                spellcheck="false"
              />
            </div>
          }
          @case ('basic') {
            <div class="grid gap-2 sm:grid-cols-2">
              <div>
                <label
                  class="mb-1 block text-xs text-slate-500"
                  for="auth-user"
                  >Username</label
                >
                <input
                  id="auth-user"
                  type="text"
                  class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100"
                  [value]="auth().basicUsername ?? ''"
                  (input)="patch({ basicUsername: $any($event.target).value })"
                  autocomplete="off"
                  spellcheck="false"
                />
              </div>
              <div>
                <label
                  class="mb-1 block text-xs text-slate-500"
                  for="auth-pass"
                  >Password</label
                >
                <input
                  id="auth-pass"
                  type="password"
                  class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100"
                  [value]="auth().basicPassword ?? ''"
                  (input)="patch({ basicPassword: $any($event.target).value })"
                  autocomplete="off"
                  spellcheck="false"
                />
              </div>
            </div>
          }
          @case ('apiKey') {
            <div class="grid gap-2 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-xs text-slate-500" for="auth-add"
                  >Enviar em</label
                >
                <select
                  id="auth-add"
                  class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  [value]="auth().apiKeyAddTo ?? 'header'"
                  (change)="
                    patch({
                      apiKeyAddTo: $any($event.target).value,
                    })
                  "
                >
                  <option value="header">Header</option>
                  <option value="query">Query string</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-xs text-slate-500" for="auth-k"
                  >Nome</label
                >
                <input
                  id="auth-k"
                  type="text"
                  class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100"
                  [value]="auth().apiKeyName ?? ''"
                  (input)="patch({ apiKeyName: $any($event.target).value })"
                  placeholder="x-api-key / api_key…"
                  autocomplete="off"
                  spellcheck="false"
                />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs text-slate-500" for="auth-val"
                >Valor</label
              >
              <input
                id="auth-val"
                type="password"
                class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100"
                [value]="auth().apiKeyValue ?? ''"
                (input)="patch({ apiKeyValue: $any($event.target).value })"
                [attr.placeholder]="phToken"
                autocomplete="off"
                spellcheck="false"
              />
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class AuthorizationEditorComponent {
  readonly phToken = '{{token}} ou valor literal';

  readonly auth = input.required<RequestAuthConfig>();
  readonly authChange = output<RequestAuthConfig>();

  setType(type: string): void {
    const t = type as AuthType;
    const cur = this.auth();
    const next: RequestAuthConfig = { type: t };
    if (t === 'bearer') next.bearerToken = cur.bearerToken ?? '';
    if (t === 'basic') {
      next.basicUsername = cur.basicUsername ?? '';
      next.basicPassword = cur.basicPassword ?? '';
    }
    if (t === 'apiKey') {
      next.apiKeyAddTo = cur.apiKeyAddTo ?? 'header';
      next.apiKeyName = cur.apiKeyName ?? '';
      next.apiKeyValue = cur.apiKeyValue ?? '';
    }
    this.authChange.emit(next);
  }

  patch(part: Partial<RequestAuthConfig>): void {
    this.authChange.emit({ ...this.auth(), ...part });
  }
}
