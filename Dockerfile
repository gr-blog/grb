# syntax=docker/dockerfile:1.4

FROM node:22-alpine AS p_base
RUN apk add --no-cache libc6-compat git
WORKDIR /app
ARG SERVICE
ENV NODE_ENV=production
ENV SERVICE=${SERVICE}
RUN echo "Service is set to: ${SERVICE}"
# enable yarn via corepack
RUN corepack enable && yarn set version 4.9.2
# bring in everything Yarn needs to confirm the install
COPY ./package.json ./yarn.lock ./.yarnrc.yml /app/
COPY ./.yarn /app/.yarn
FROM p_base AS p_deps
# install runtime dependencies
ARG SERVICE

COPY packages/$SERVICE/package.json packages/$SERVICE/
RUN yarn workspaces focus ${SERVICE}

FROM p_base AS builder
COPY --from=p_deps /app/node_modules ./node_modules
COPY --from=p_deps /app/.yarn ./.yarn

COPY ./packages/$SERVICE ./packages/${SERVICE}

ENV NEXT_TELEMETRY_DISABLED=1
COPY tsconfig.json ./
COPY packages/tsconfig.base.json ./packages/tsconfig.base.json
RUN cd packages/$SERVICE && yarn build

FROM p_base AS p_app_base
# production settings
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    HOSTNAME="0.0.0.0"
# add non-root user
RUN addgroup --system --gid 2111 grb && adduser --system --uid 2111 --ingroup grb grb
USER grb

FROM p_app_base AS frontend
# copy built standalone and static files

COPY --from=builder --chown=grb:grb \
    /app/packages/frontend/package.json \
    /app/packages/frontend/.next/standalone \
    ./
COPY --from=builder --chown=grb:grb /app/packages/frontend/.next/static /app/packages/frontend/.next/static
COPY --from=builder --chown=grb:grb /app/packages/frontend/assets /app/packages/frontend/assets
COPY --chown=grb:grb  ./packages/frontend/public /app/packages/frontend/public
# expose port and run
EXPOSE 3001
ENV PORT=3001
CMD ["node","packages/frontend/server.js"]

FROM p_app_base AS api
# copy built API bundle and deps
COPY --from=builder --chown=grb:grb /app/packages/${SERVICE}/dist ./dist
COPY --from=builder --chown=grb:grb /app/packages/${SERVICE}/package.json ./
COPY --from=builder --chown=grb:grb /app/node_modules ./node_modules
EXPOSE 3000
ENV PORT=3000
CMD ["node","dist/main.js"]
FROM p_app_base AS bot
COPY --from=builder --chown=grb:grb /app/packages/${SERVICE}/dist ./dist
COPY --from=builder --chown=grb:grb /app/packages/${SERVICE}/package.json ./
COPY --from=builder --chown=grb:grb /app/node_modules ./node_modules
EXPOSE 3002
ENV PORT=3002
CMD ["node","dist/main.js"]