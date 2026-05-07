FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build && npm prune --omit=dev

EXPOSE 3000

CMD ["node", "dist/main.js"]
