#!/usr/bin/env bash
set -e

[ -d /tmp/k9/feature-toggle ] && echo "Feature toggle-directory finnes fra før, tilbakestiller" && rm -r /tmp/k9/feature-toggle/* || mkdir -p  /tmp/k9/feature-toggle
envsubst < /etc/nginx/conf.d/feature-toggles.json > /tmp/k9/feature-toggle/toggles.json

export APP_HOSTNAME="${HOSTNAME:-localhost}"
export APP_PORT="${APP_PORT:-443}"
export APP_NAME="${APP_NAME:-devimg}"
export APP_VERSION="${APP_VERSION:-localhost}"

envsubst '$APP_URL $APP_PORT $APP_HOSTNAME $APP_NAME $APP_VERSION $APP_URL_K9FORMIDLING $APP_URL_K9FORMIDLING_DD $APP_URL_K9OPPDRAG $APP_URL_KLAGE $APP_URL_K9TILBAKE $APP_URL_K9FORDEL $ENDRINGSLOGG_URL' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf

echo "### Nginx conf ###"
cat /etc/nginx/conf.d/default.conf
echo
echo "### Feature toggles ###"
cat /tmp/k9/feature-toggle/toggles.json

nginx -g "daemon off;" &
pid=$!
wait "$pid"
