FROM node:slim AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev ca-certificates

RUN corepack enable && corepack prepare pnpm --activate

COPY . .

RUN pnpm run db:deploy

RUN pnpm run db:generate

RUN pnpm run build

FROM base AS deps

RUN pnpm install --frozen-lockfile --prod

FROM node:23-bookworm-slim AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm --activate

ENV TZ=Asia/Seoul
ENV NODE_ENV=production

RUN apt-get update -y
RUN apt-get install -y openssl ca-certificates libssl3

COPY --from=build /app/dist dist
COPY --from=build /app/package.json .
COPY --from=build /app/prisma prisma
COPY --from=deps /app/node_modules node_modules
COPY --from=build /app/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/.prisma node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.8.3__typescript@5.8.3/node_modules/.prisma

RUN mkdir -p /app/tmp && chmod 777 /app/tmp

EXPOSE 8000

USER node

CMD ["pnpm", "run", "start:prod"]