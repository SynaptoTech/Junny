FROM node:20-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps ./apps
COPY packages ./packages
COPY examples ./examples

RUN npm ci
RUN npm run build -w @junny/server

FROM node:20-alpine AS prod

RUN apk add --no-cache python3 make g++

WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps ./apps
COPY packages ./packages
COPY examples ./examples

RUN npm ci --omit=dev --workspace=@junny/server

COPY --from=build /repo/apps/server/dist ./apps/server/dist

RUN mkdir -p /app/data

ENV SQLITE_PATH=/app/data/junny.sqlite
ENV NODE_ENV=production

EXPOSE 3000

WORKDIR /repo

CMD ["node", "apps/server/dist/main.js"]
