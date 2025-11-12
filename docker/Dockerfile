# BASE
FROM node:lts-alpine AS base

WORKDIR /app

COPY package*.json ./

# DEPENDENCIES
FROM base AS dependencies

RUN npm ci --omit=dev

# BUILDER
FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build

# RELEASE
FROM base AS release

RUN apk add --no-cache tini bash

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder      /app/dist ./dist
COPY --from=builder      /app/view ./view

ENV NODE_ENV=production

ENTRYPOINT [ "/sbin/tini", "--", "node", "dist/main" ]
