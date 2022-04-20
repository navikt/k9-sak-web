#!/usr/bin/env bash
set -e

_shutdown_() {
  # https://github.com/kubernetes/contrib/issues/1140
  # https://github.com/kubernetes/kubernetes/issues/43576
  # https://github.com/kubernetes/kubernetes/issues/64510
  # https://nav-it.slack.com/archives/C5KUST8N6/p1543497847341300
  echo "shutdown initialized, allowing incoming requests for 5 seconds before continuing"
  sleep 5
  nginx -s quit
  wait "$pid"
}
trap _shutdown_ SIGTERM
[ -d /tmp/k9/feature-toggle ] && echo "Feature toggle-directory finnes fra før, tilbakestiller" && rm -r /tmp/k9/feature-toggle/* || mkdir -p  /tmp/k9/feature-toggle
envsubst < /etc/nginx/conf.d/feature-toggles.json > /tmp/k9/feature-toggle/toggles.json

export APP_HOSTNAME="${HOSTNAME:-localhost}"
export APP_PORT="${APP_PORT:-443}"
export APP_NAME="${APP_NAME:-devimg}"
export APP_VERSION="${APP_VERSION:-localhost}"

envsubst '$APP_URL $APP_PORT $APP_HOSTNAME $APP_NAME $APP_VERSION $APP_PATH_PREFIX $APP_URL_K9FORMIDLING $APP_URL_K9FORMIDLING_DD $APP_URL_K9OPPDRAG $APP_URL_KLAGE $APP_URL_K9TILBAKE $APP_URL_K9FORDEL $APP_DIAGNOSEKODER $MEDISINSK_VILKAR_FRONTEND_URL $OMSORGSDAGER_FRONTEND_URL $PSB_UTTAK_FRONTEND_URL $OMSORGEN_FOR_FRONTEND_URL $PSB_INNTEKTSMELDING_FRONTEND_URL $PSB_ETABLERT_TILSYN_FRONTEND_URL $PSB_OM_BARNET_FRONTEND_URL $ENDRINGSLOGG_URL' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf

echo "### Nginx conf ###"
cat /etc/nginx/conf.d/default.conf
echo
echo "### Feature toggles ###"
cat /tmp/k9/feature-toggle/toggles.json

nginx -g "daemon off;" &
pid=$!
wait "$pid"
