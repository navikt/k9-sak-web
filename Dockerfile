FROM nginx:1.17.8-alpine

LABEL org.opencontainers.image.source=https://github.com/navikt/k9-sak-web

# bash er ikke standard i alpine:
RUN apk add --no-cache bash

ADD proxy.nginx /etc/nginx/conf.d/app.conf.template
ADD feature-toggles.json /etc/nginx/conf.d/feature-toggles.json

ENV APP_DIR="/app" \
  APP_PATH_PREFIX="/k9/sak" \
  APP_CALLBACK_PATH="/k9/sak/cb" \
  APP_URL_SAK="http://k9-sak"

COPY dist /usr/share/nginx/html

EXPOSE 9000 443

# using bash over sh for better signal-handling
SHELL ["/bin/bash", "-c"]
ADD start-server.sh /start-server.sh
CMD /start-server.sh
