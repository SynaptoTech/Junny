-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkspaceInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "invitedByUserId" TEXT,
    "acceptedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceInvite_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkspaceInvite_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "authConfig" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Collection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Collection" ("authConfig", "createdAt", "description", "id", "name", "updatedAt") SELECT "authConfig", "createdAt", "description", "id", "name", "updatedAt" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
CREATE INDEX "Collection_workspaceId_idx" ON "Collection"("workspaceId");
CREATE TABLE "new_Environment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Environment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Environment" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Environment";
DROP TABLE "Environment";
ALTER TABLE "new_Environment" RENAME TO "Environment";
CREATE INDEX "Environment_workspaceId_idx" ON "Environment"("workspaceId");
CREATE TABLE "new_HistoryEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT,
    "request" JSONB NOT NULL,
    "response" JSONB NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "protocol" TEXT NOT NULL DEFAULT 'REST',
    "method" TEXT NOT NULL DEFAULT 'GET',
    "url" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "HistoryEntry_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HistoryEntry" ("createdAt", "duration", "id", "method", "protocol", "request", "response", "status", "url") SELECT "createdAt", "duration", "id", "method", "protocol", "request", "response", "status", "url" FROM "HistoryEntry";
DROP TABLE "HistoryEntry";
ALTER TABLE "new_HistoryEntry" RENAME TO "HistoryEntry";
CREATE INDEX "HistoryEntry_workspaceId_idx" ON "HistoryEntry"("workspaceId");
CREATE TABLE "new_StoredRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT,
    "protocol" TEXT NOT NULL DEFAULT 'REST',
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "params" JSONB NOT NULL DEFAULT '{}',
    "tag" TEXT,
    "graphqlVariables" JSONB,
    "body" TEXT,
    "authConfig" JSONB,
    "collectionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StoredRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StoredRequest_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StoredRequest" ("authConfig", "body", "collectionId", "createdAt", "graphqlVariables", "headers", "id", "method", "params", "protocol", "tag", "updatedAt", "url") SELECT "authConfig", "body", "collectionId", "createdAt", "graphqlVariables", "headers", "id", "method", "params", "protocol", "tag", "updatedAt", "url" FROM "StoredRequest";
DROP TABLE "StoredRequest";
ALTER TABLE "new_StoredRequest" RENAME TO "StoredRequest";
CREATE INDEX "StoredRequest_workspaceId_idx" ON "StoredRequest"("workspaceId");
CREATE INDEX "StoredRequest_collectionId_idx" ON "StoredRequest"("collectionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvite_token_key" ON "WorkspaceInvite"("token");

-- CreateIndex
CREATE INDEX "WorkspaceInvite_workspaceId_idx" ON "WorkspaceInvite"("workspaceId");

-- CreateIndex
CREATE INDEX "WorkspaceInvite_email_idx" ON "WorkspaceInvite"("email");
