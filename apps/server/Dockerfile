FROM node:20-alpine AS build

WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps ./apps
COPY packages ./packages
COPY examples ./examples

RUN npm ci
RUN npm run build -w @junny/server

FROM node:20-alpine AS prod

WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps ./apps
COPY packages ./packages
COPY examples ./examples

RUN npm ci --omit=dev --workspace=@junny/server

COPY --from=build /repo/apps/server/dist ./apps/server/dist
COPY --from=build /repo/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /repo/node_modules/@prisma ./node_modules/@prisma

RUN mkdir -p /app/data

ENV DATABASE_URL=file:/app/data/dev.db
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR /repo

CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/server/prisma/schema.prisma && exec node apps/server/dist/main.js"]
