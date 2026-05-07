-- AlterTable
ALTER TABLE "StoredRequest" ADD COLUMN "protocol" TEXT NOT NULL DEFAULT 'REST';
ALTER TABLE "StoredRequest" ADD COLUMN "graphqlVariables" JSONB;
