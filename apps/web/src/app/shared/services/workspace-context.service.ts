import { Injectable, signal } from '@angular/core';

export interface WorkspaceMeta {
  id: string;
  name: string;
  createdAt: string;
}

type StorageShapeV1 = {
  activeId: string;
  workspaces: WorkspaceMeta[];
};

const STORAGE_KEY = 'junny-workspaces-v1';

function defaultWorkspace(): WorkspaceMeta {
  return {
    id: crypto.randomUUID(),
    name: 'Personal',
    createdAt: new Date().toISOString(),
  };
}

function safeParse(raw: string | null): StorageShapeV1 | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StorageShapeV1>;
    if (!Array.isArray(parsed.workspaces) || !parsed.workspaces.length) return null;
    const workspaces = parsed.workspaces
      .filter((w) => w && typeof w.id === 'string' && typeof w.name === 'string')
      .map((w) => ({
        id: w.id,
        name: w.name,
        createdAt:
          typeof (w as { createdAt?: unknown }).createdAt === 'string'
            ? (w as { createdAt: string }).createdAt
            : new Date().toISOString(),
      }));
    if (!workspaces.length) return null;
    const activeId =
      typeof parsed.activeId === 'string' && workspaces.some((w) => w.id === parsed.activeId)
        ? parsed.activeId
        : workspaces[0].id;
    return { activeId, workspaces };
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class WorkspaceContextService {
  readonly workspaces = signal<WorkspaceMeta[]>([]);
  readonly activeWorkspaceId = signal<string>('');

  constructor() {
    this.hydrate();
  }

  private hydrate(): void {
    if (typeof localStorage === 'undefined') {
      const w = defaultWorkspace();
      this.workspaces.set([w]);
      this.activeWorkspaceId.set(w.id);
      return;
    }

    const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
    if (parsed) {
      this.workspaces.set(parsed.workspaces);
      this.activeWorkspaceId.set(parsed.activeId);
      return;
    }

    const w = defaultWorkspace();
    this.workspaces.set([w]);
    this.activeWorkspaceId.set(w.id);
    this.persist();
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activeId: this.activeWorkspaceId(),
        workspaces: this.workspaces(),
      } satisfies StorageShapeV1),
    );
  }

  setActiveWorkspace(id: string): void {
    if (!id || !this.workspaces().some((w) => w.id === id)) return;
    this.activeWorkspaceId.set(id);
    this.persist();
  }

  createWorkspace(name: string): WorkspaceMeta {
    const trimmed = name.trim().slice(0, 80);
    const w: WorkspaceMeta = {
      id: crypto.randomUUID(),
      name: trimmed || 'Untitled',
      createdAt: new Date().toISOString(),
    };
    this.workspaces.update((list) => [w, ...list]);
    this.activeWorkspaceId.set(w.id);
    this.persist();
    return w;
  }
}

