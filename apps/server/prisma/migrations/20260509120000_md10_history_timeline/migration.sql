-- Denormalização para listagem, filtros e timeline (MD10)
ALTER TABLE "HistoryEntry" ADD COLUMN "protocol" TEXT NOT NULL DEFAULT 'REST';
ALTER TABLE "HistoryEntry" ADD COLUMN "method" TEXT NOT NULL DEFAULT 'GET';
ALTER TABLE "HistoryEntry" ADD COLUMN "url" TEXT NOT NULL DEFAULT '';
