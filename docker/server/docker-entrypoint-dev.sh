#!/bin/sh
set -e
export DATABASE_URL="${DATABASE_URL:-file:/app/data/dev.db}"
mkdir -p /app/data
cd /repo/apps/server
npx prisma migrate deploy
npx prisma generate
cd /repo
exec npm run start:dev -w @junny/server
