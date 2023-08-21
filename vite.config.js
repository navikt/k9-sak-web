import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { resolve } from 'path';

import vtpLogin from './webpack/mocks/login';
import sentryMock from './webpack/mocks/sentry';
import featureToggles from './webpack/mocks/feature-toggles';
import fakeError from './webpack/mocks/fake-error';
import { PUBLIC_PATH } from './webpack/constants';

// Convert your Webpack proxy to Vite's style
const createProxy = (target, pathRewrite = {}) => ({
  target,
  changeOrigin: true,
  ws: false,
  rewrite: path => path.replace(new RegExp(Object.keys(pathRewrite)[0]), pathRewrite[Object.keys(pathRewrite)[0]]),
});

export default defineConfig({
  //   optimizeDeps: {
  //     include: [
  //       '@k9-sak-web/fakta-opplaering',
  //       '@fpsak-frontend/prosess-vedtak',
  //       '@k9-sak-web/prosess-aarskvantum-oms',
  //       '@fpsak-frontend/sak-sok',
  //       '@k9-sak-web/konstanter',
  //       '@fpsak-frontend/sak-dekorator',
  //       '@fpsak-frontend/sak-meny-henlegg',
  //       '@fpsak-frontend/sak-meny-endre-enhet',
  //       '@k9-sak-web/prosess-vilkar-soknadsfrist',
  //       '@fpsak-frontend/form',
  //       '@k9-sak-web/sak-behandling-velger',
  //       '@k9-sak-web/types',
  //       '@fpsak-frontend/prosess-tilkjent-ytelse',
  //       '@fpsak-frontend/prosess-tilbakekreving',
  //       '@k9-sak-web/prosess-vilkar-sykdom',
  //       '@fpsak-frontend/utils-test',
  //       '@fpsak-frontend/prosess-avregning',
  //       '@fpsak-frontend/prosess-innsyn',
  //       '@fpsak-frontend/prosess-vedtak-innsyn',
  //       '@k9-sak-web/behandling-omsorgspenger',
  //       '@fpsak-frontend/fakta-overstyr-beregning',
  //       '@k9-sak-web/fakta-felles',
  //       '@fpsak-frontend/prosess-anke-merknader',
  //       '@k9-sak-web/behandling-opplaeringspenger',
  //       '@fpsak-frontend/prosess-anke',
  //       '@fpsak-frontend/fakta-medlemskap',
  //       '@k9-sak-web/behandling-pleiepenger-sluttfase',
  //       '@fpsak-frontend/fakta-feilutbetaling',
  //       '@fpsak-frontend/sak-meny-ta-av-vent',
  //       '@fpsak-frontend/fakta-arbeidsforhold',
  //       '@fpsak-frontend/fakta-inntekt-og-ytelser',
  //       '@k9-sak-web/sak-app',
  //       '@fpsak-frontend/prosess-vilkar-overstyring',
  //       '@k9-sak-web/behandling-felles',
  //       '@k9-sak-web/prosess-unntak',
  //       '@fpsak-frontend/utils',
  //       '@fpsak-frontend/sak-risikoklassifisering',
  //       '@k9-sak-web/fakta-institusjon',
  //       '@fpsak-frontend/prosess-vedtak-klage',
  //       '@k9-sak-web/sak-meldinger',
  //       '@fpsak-frontend/sak-meny-verge',
  //       '@k9-sak-web/behandling-pleiepenger',
  //       '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt',
  //       '@fpsak-frontend/sak-totrinnskontroll',
  //       '@fpsak-frontend/prosess-formkrav',
  //       '@fpsak-frontend/prosess-klagevurdering',
  //       '@fpsak-frontend/prosess-foreldelse',
  //       '@fpsak-frontend/fakta-direkte-overgang',
  //       '@k9-sak-web/sak-infosider',
  //       '@k9-sak-web/behandling-tilbakekreving',
  //       '@k9-sak-web/sak-aktor',
  //       '@k9-sak-web/sak-meny-marker-behandling',
  //       '@k9-sak-web/behandling-innsyn',
  //       '@fpsak-frontend/sak-visittkort',
  //       '@k9-sak-web/prosess-vilkar-alder',
  //       '@k9-sak-web/modal-sett-pa-vent',
  //       '@fpsak-frontend/fakta-bosted-soker',
  //       '@fpsak-frontend/fakta-verge',
  //       '@k9-sak-web/prosess-uttak-antall-dager-sluttfase',
  //       '@fpsak-frontend/prosess-saksopplysninger',
  //       '@fpsak-frontend/fakta-opplysninger-fra-soknaden',
  //       '@fpsak-frontend/prosess-vedtak-tilbakekreving',
  //       '@fpsak-frontend/kodeverk',
  //       '@k9-sak-web/rest-api-hooks',
  //       '@fpsak-frontend/shared-components',
  //       '@fpsak-frontend/prop-types',
  //       '@fpsak-frontend/prosess-soknadsfrist',
  //       '@fpsak-frontend/sak-support-meny',
  //       '@fpsak-frontend/sak-meny-ny-behandling',
  //       '@k9-sak-web/behandling-klage',
  //       '@k9-sak-web/fremdriftslinje',
  //       '@fpsak-frontend/sak-fagsak-profil',
  //       '@fpsak-frontend/sak-meny-sett-pa-vent',
  //       '@fpsak-frontend/prosess-varsel-om-revurdering',
  //       '@k9-sak-web/behandling-anke',
  //       '@k9-sak-web/fakta-soknadsperioder',
  //       '@fpsak-frontend/sak-historikk',
  //       '@fpsak-frontend/sak-meny',
  //       '@fpsak-frontend/assets',
  //       '@k9-sak-web/behandling-frisinn',
  //       '@k9-sak-web/behandling-unntak',
  //       '@fpsak-frontend/tidslinje',
  //       '@k9-sak-web/fakta-barn-oms',
  //       '@k9-sak-web/sak-soknadsperiodestripe',
  //       '@k9-sak-web/prosess-felles',
  //       '@fpsak-frontend/prosess-vilkar-opptjening-oms',
  //       '@k9-sak-web/behandling-utvidet-rett',
  //       '@fpsak-frontend/sak-dokumenter',
  //       '@k9-sak-web/rest-api',
  //       '@fpsak-frontend/fakta-opptjening-oms',
  //       '@k9-sak-web/fakta-barn-og-overfoeringsdager',
  //       '@fpsak-frontend/prosess-anke-resultat',
  //     ],
  //   },
  server: {
    port: 9000,
  },
  publicDir: './public',
  plugins: [
    react({
      include: [/\.jsx$/, /\.tsx?$/],
    }),
  ],
  build: {
    // Relative to the root
    outDir: './dist/k9/web',
  },

  css: {
    preprocessorOptions: {
      less: {
        includePaths: ['./node_modules'],
        javascriptEnabled: true,
      },
    },
  },

  proxy: {
    proxy: {
      '/k9/formidling/dokumentdata/**': createProxy(process.env.APP_URL_K9FORMIDLING_DD || 'http://localhost:8294'),
      '/k9/formidling/**': createProxy(process.env.APP_URL_K9FORMIDLING || 'http://localhost:8290'),
      '/k9/sak/**': createProxy(process.env.APP_URL_SAK || 'http://localhost:8080'), // Note: onProxyRes needs to be handled separately
      '/k9/oppdrag/**': createProxy(process.env.APP_URL_K9OPPDRAG || 'http://localhost:8070'),
      '/k9/klage/**': createProxy(process.env.APP_URL_KLAGE || 'http://localhost:8701'),
      '/k9/tilbake/**': createProxy(process.env.APP_URL_K9TILBAKE || 'http://localhost:8030'),

      '/k9/diagnosekoder/': createProxy(process.env.APP_URL_DIAGNOSEKODER || 'http://localhost:8300', {
        '^/k9/diagnosekoder/': '/diagnosekoder',
      }),

      '/k9/microfrontend/omsorgsdager/**': createProxy(
        process.env.OMSORGSDAGER_FRONTEND_URL || 'http://localhost:8088',
        {
          '^/k9/microfrontend/omsorgsdager': '',
        },
      ),
      '/k9/microfrontend/medisinsk-vilkar/**': createProxy(
        process.env.MEDISINSK_VILKAR_FRONTEND_URL || 'http://localhost:8081',
        {
          '^/k9/microfrontend/medisinsk-vilkar': '',
        },
      ),
      '/k9/microfrontend/omsorgen-for/**': createProxy(
        process.env.OMSORGEN_FOR_FRONTEND_URL || 'http://localhost:8282',
        {
          '^/k9/microfrontend/omsorgen-for': '',
        },
      ),
      '/k9/microfrontend/psb-om-barnet/**': createProxy(
        process.env.PSB_OM_BARNET_FRONTEND_URL || 'http://localhost:8585',
        {
          '^/k9/microfrontend/psb-om-barnet': '',
        },
      ),
      '/k9/microfrontend/psb-etablert-tilsyn/**': createProxy(
        process.env.PSB_ETABLERT_TILSYN_FRONTEND_URL || 'http://localhost:8484',
        {
          '^/k9/microfrontend/psb-etablert-tilsyn': '',
        },
      ),
      '/k9/microfrontend/psb-uttak/**': createProxy(process.env.PSB_UTTAK_FRONTEND_URL || 'http://localhost:8181', {
        '^/k9/microfrontend/psb-uttak': '',
      }),
      '/k9/microfrontend/psb-inntektsmelding/**': createProxy(
        process.env.PSB_INNTEKTSMELDING_FRONTEND_URL || 'http://localhost:8383',
        {
          '^/k9/microfrontend/psb-inntektsmelding': '',
        },
      ),
      '/k9/endringslogg/**': createProxy(
        process.env.ENDRINGSLOGG_URL || 'https://familie-endringslogg.intern.dev.nav.no',
        {
          '^/k9/endringslogg': '',
        },
      ),
    },
  },
});
