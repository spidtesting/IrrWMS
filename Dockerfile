# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ─── Dependencies ──────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
# Skip husky git hooks in CI/Docker; lock file must match package.json (commit both together)
ENV HUSKY=0
RUN npm ci --ignore-scripts

# ─── Builder ───────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Build-time placeholders (override at runtime on Railway)
ENV SKIP_ENV_VALIDATION=true
ENV LOG_LEVEL=info
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build?schema=public
ENV DIRECT_URL=postgresql://build:build@127.0.0.1:5432/build?schema=public
ENV NEXTAUTH_SECRET=build-time-placeholder-secret-min-32-chars
ENV NEXTAUTH_URL=http://127.0.0.1:3000
ENV NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000

RUN npx prisma generate
RUN npm run build

# ─── Runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]

# ─── Worker target ─────────────────────────────────────────────────────────────
FROM base AS worker
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 worker

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json tsconfig.json ./
COPY prisma ./prisma
COPY server ./server
COPY lib ./lib
COPY config ./config

USER worker

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD pgrep -f "server/worker" || exit 1

CMD ["npx", "tsx", "server/worker.ts"]

# ─── Socket server target ──────────────────────────────────────────────────────
FROM base AS socket
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 socket

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json tsconfig.json ./
COPY prisma ./prisma
COPY server ./server
COPY lib ./lib
COPY config ./config
COPY auth.ts auth.config.ts ./

USER socket

EXPOSE 3001
ENV SOCKET_PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["npx", "tsx", "server/socket.ts"]
