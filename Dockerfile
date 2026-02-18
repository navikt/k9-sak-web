FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim

# These must be set when building for ung-sak-web. Defaults are for k9-sak-web.
ARG appVariant=k9
ARG port=9000

LABEL org.opencontainers.image.source=https://github.com/navikt/k9-sak-web

ENV NODE_ENV=production \
    APP_VARIANT=$appVariant \
    PORT=$port

WORKDIR /app

# Copy compiled server, production dependencies, and frontend build from CI.
COPY server/dist/ ./
COPY server/node_modules/ ./node_modules/
COPY dist/ ./dist/

EXPOSE $port

CMD ["server.js"]
