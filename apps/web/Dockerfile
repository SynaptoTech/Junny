FROM node:20-alpine AS build

WORKDIR /repo

RUN apk add --no-cache git

COPY package.json package-lock.json ./
COPY apps ./apps
COPY packages ./packages
COPY examples ./examples

RUN npm ci
RUN npm run build -w @junny/docs
RUN npm run build -w @junny/web

FROM nginx:alpine

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist/web/browser /usr/share/nginx/html
COPY --from=build /repo/apps/docs/.vitepress/dist /usr/share/nginx/html/docs

EXPOSE 80
