# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=
ARG ROBOTS_INDEXING_ENABLED=false
ARG NEXT_DEPLOYMENT_ID=
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    ROBOTS_INDEXING_ENABLED=${ROBOTS_INDEXING_ENABLED} \
    NEXT_DEPLOYMENT_ID=${NEXT_DEPLOYMENT_ID}
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
RUN groupadd --system --gid 10001 nodejs && useradd --system --uid 10001 --gid nodejs --create-home nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/db ./db
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/postgres ./node_modules/postgres
COPY --chown=nextjs:nodejs docker/runtime-entrypoint.sh ./docker/runtime-entrypoint.sh
RUN chmod 0555 ./docker/runtime-entrypoint.sh && mkdir -p /tmp && chown nextjs:nodejs /tmp
USER nextjs
EXPOSE 3000
ENTRYPOINT ["./docker/runtime-entrypoint.sh"]
CMD ["node", "server.js"]
