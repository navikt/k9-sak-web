FROM nginxinc/nginx-unprivileged:stable-alpine-slim
# These must be set when building for ung-sak-web. Defaults are for k9-sak-web
ARG proxyConfig=proxy.nginx
ARG featureToggles=feature-toggles.json
ARG appVariant=k9

LABEL org.opencontainers.image.source=https://github.com/navikt/k9-sak-web

ADD $proxyConfig /etc/nginx/conf.d/app.conf.template
ADD $featureToggles /etc/nginx/conf.d/feature-toggles.json
ADD start-server.sh /start-server.sh

ENV APP_DIR="/app" \
  APP_PATH_PREFIX="/$appVariant/sak" \
  APP_CALLBACK_PATH="/$appVariant/sak/cb" \
  APP_URL_SAK="http://$appVariant-sak"

COPY dist /usr/share/nginx/html

EXPOSE 9000

# using bash over sh for better signal-handling
CMD sh /start-server.sh
