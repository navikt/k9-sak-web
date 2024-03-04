FROM nginx

LABEL org.opencontainers.image.source=https://github.com/navikt/k9-sak-web

ADD proxy.nginx /etc/nginx/conf.d/app.conf.template
ADD feature-toggles.json /etc/nginx/conf.d/feature-toggles.json
ADD start-server.sh /start-server.sh

ENV APP_DIR="/app" \
  APP_PATH_PREFIX="/k9/sak" \
  APP_CALLBACK_PATH="/k9/sak/cb" \
  APP_URL_SAK="http://k9-sak"

COPY dist /usr/share/nginx/html

EXPOSE 9000

# using bash over sh for better signal-handling
CMD sh /start-server.sh
