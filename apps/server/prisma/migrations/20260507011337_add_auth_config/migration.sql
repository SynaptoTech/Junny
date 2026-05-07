-- AlterTable
ALTER TABLE "Collection" ADD COLUMN "authConfig" JSONB;

-- AlterTable
ALTER TABLE "StoredRequest" ADD COLUMN "authConfig" JSONB;
