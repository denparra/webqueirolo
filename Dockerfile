# syntax=docker/dockerfile:1.7
#
# Image for the DESTINO VPS (Docker Compose behind Caddy). Easypanel/Nixpacks keeps
# building the current production site; this file does not change that path.
#
# Build requirements (see docs/reference/deuda-tecnica.md and .npmrc):
# - Node 22 (package.json "engines"); `npm ci --legacy-peer-deps`.
# - .npmrc must be in the build context (include=dev): next build needs devDependencies.
# - NODE_ENV is NOT set in the build stage; `next build` sets it itself.
# - NEXT_PUBLIC_* are inlined at build time: a change means a rebuild.
# - sharp needs glibc, so the base is node:22-slim (not alpine).
ARG NODE_IMAGE=node:22-slim@sha256:5ec23b7c622b00547753bc6ffd78085dd868a68aeb41c8e0a1418f033e13d96d

FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json .npmrc ./
RUN npm ci --legacy-peer-deps

COPY . .

# Public values only (they end up in the client bundle). Never pass secrets as ARG.
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_GSC_VERIFICATION
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
    NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
    NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_GSC_VERIFICATION=$NEXT_PUBLIC_GSC_VERIFICATION \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

# Optional stable key for Server Actions IDs. It is a secret, so it comes in as a
# BuildKit secret (not an ARG: ARG values are visible in `docker history`).
# If it is absent or empty, Next generates one per build.
RUN --mount=type=secret,id=server_actions_key \
    if [ -s /run/secrets/server_actions_key ]; then \
      export NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="$(cat /run/secrets/server_actions_key)"; \
    fi; \
    npm run build

FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    UV_THREADPOOL_SIZE=16 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build --chown=node:node /app/package.json /app/package-lock.json /app/.npmrc /app/next.config.js ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node_modules/.bin/next", "start"]
