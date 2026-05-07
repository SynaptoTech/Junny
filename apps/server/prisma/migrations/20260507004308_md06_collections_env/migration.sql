-- CreateTable
CREATE TABLE "EnvironmentVariable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "environmentId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "EnvironmentVariable_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migrate legacy JSON variables → linhas (SQLite json_each)
INSERT INTO "EnvironmentVariable" ("id", "environmentId", "key", "value")
SELECT lower(hex(randomblob(16))), e."id", j."key", j."value"
FROM "Environment" e, json_each(e."variables") AS j;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Collection" ("createdAt", "description", "id", "name", "updatedAt")
SELECT "createdAt", "description", "id", "name", "createdAt" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
CREATE TABLE "new_Environment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Environment" ("createdAt", "id", "name", "updatedAt")
SELECT "createdAt", "id", "name", "createdAt" FROM "Environment";
DROP TABLE "Environment";
ALTER TABLE "new_Environment" RENAME TO "Environment";
CREATE TABLE "new_StoredRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "params" JSONB NOT NULL DEFAULT '{}',
    "body" TEXT,
    "collectionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StoredRequest_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StoredRequest" ("body", "collectionId", "createdAt", "headers", "id", "method", "params", "updatedAt", "url")
SELECT "body", "collectionId", "createdAt", "headers", "id", "method", '{}', "createdAt", "url" FROM "StoredRequest";
DROP TABLE "StoredRequest";
ALTER TABLE "new_StoredRequest" RENAME TO "StoredRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentVariable_environmentId_key_key" ON "EnvironmentVariable"("environmentId", "key");
