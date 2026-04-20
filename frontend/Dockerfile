FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM alpine:3.20 AS artifact
WORKDIR /app

COPY --from=build /app/dist ./dist

CMD ["sh", "-c", "mkdir -p /frontend-dist && find /frontend-dist -mindepth 1 -delete && cp -R /app/dist/. /frontend-dist/"]
