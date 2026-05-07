import type { WorkspaceTabState } from '../models/workspace.models';

/** Conteúdo relevante para dirty-check (sem id, título, ligação ao servidor). */
export function workspaceTabContentFingerprint(tab: WorkspaceTabState): string {
  return JSON.stringify({
    method: tab.method,
    url: tab.url,
    headerRows: tab.headerRows,
    paramRows: tab.paramRows,
    bodyText: tab.bodyText,
    auth: tab.auth,
  });
}

export function isWorkspaceTabDirty(tab: WorkspaceTabState): boolean {
  return workspaceTabContentFingerprint(tab) !== tab.savedFingerprint;
}
