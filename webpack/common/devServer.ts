import vtpLogin from '../mocks/login';
import sentryMock from '../mocks/sentry';
import featureToggles from '../mocks/feature-toggles';
import fakeError from '../mocks/fake-error';

import { PUBLIC_PATH } from '../constants';

export default {
  port: 9000,
  hot: true,
  // client: false,
  // noInfo: true,
  // liveReload: false,
  // watchFiles: {
  //   paths: [path.join(PACKAGES_DIR, '**/*')],
  //   options: {
  //     usePolling: false,
  //   },
  // },
  // publicPath: PUBLIC_PATH,
  client: {
    overlay: {
      errors: false,
      warnings: false,
    },
  },
  devMiddleware: {
    publicPath: PUBLIC_PATH,
    stats: {
      children: false,
      colors: true,
    },
  },
  historyApiFallback: {
    index: PUBLIC_PATH,
  },
  onBeforeSetupMiddleware: function ({ app }) {
    vtpLogin(app);
    sentryMock(app);
    fakeError(app);
    featureToggles(app);
    // if (process.argv.includes('--feature-toggles')) {
    //   console.warn('Mocking feature toggles');
    //   featureToggles(app);
    // }
  },
  proxy: {
    '/k9/formidling/dokumentdata/**': {
      target: process.env.APP_URL_K9FORMIDLING_DD || 'http://localhost:8294',
      secure: false,
      changeOrigin: !!process.env.APP_URL_K9FORMIDLING_DD,
    },
    '/k9/formidling/**': {
      target: process.env.APP_URL_K9FORMIDLING || 'http://localhost:8290',
      secure: false,
      changeOrigin: !!process.env.APP_URL_K9FORMIDLING,
    },
    '/k9/sak/**': {
      target: process.env.APP_URL_SAK || 'http://localhost:8080',
      secure: false,
      changeOrigin: !!process.env.APP_URL_SAK,
      onProxyRes: function onProxyRes(proxyRes, req, res) {
        // For å håndtere redirects på 202 Accepted responser med location headers...
        if (proxyRes.headers.location && proxyRes.headers.location.startsWith(process.env.APP_URL_SAK)) {
          proxyRes.headers.location = proxyRes.headers.location.split(process.env.APP_URL_SAK)[1];
        }
        if (proxyRes.statusCode === 401) {
          proxyRes.headers.location = '/k9/sak/resource/login';
        }
      },
    },
    '/k9/oppdrag/**': {
      target: process.env.APP_URL_K9OPPDRAG || 'http://localhost:8070',
      secure: false,
      changeOrigin: !!process.env.APP_URL_K9OPPDRAG,
    },
    '/k9/klage/**': {
      target: process.env.APP_URL_KLAGE || 'http://localhost:8701',
      secure: false,
      changeOrigin: !!process.env.APP_URL_KLAGE,
    },
    '/k9/tilbake/**': {
      target: process.env.APP_URL_K9TILBAKE || 'http://localhost:8030',
      secure: false,
      changeOrigin: !!process.env.APP_URL_K9TILBAKE,
    },
    '/k9/diagnosekoder/': {
      target: process.env.APP_URL_DIAGNOSEKODER || 'http://localhost:8300',
      pathRewrite: {
        '^/k9/diagnosekoder/': '/diagnosekoder',
      },
      secure: false,
      changeOrigin: !!process.env.APP_URL_DIAGNOSEKODER,
    },
    '/k9/microfrontend/omsorgsdager/**': {
      target: process.env.OMSORGSDAGER_FRONTEND_URL || 'http://localhost:8088',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/microfrontend/omsorgsdager': '' },
    },
    '/k9/microfrontend/medisinsk-vilkar/**': {
      target: process.env.MEDISINSK_VILKAR_FRONTEND_URL || 'http://localhost:8081',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/microfrontend/medisinsk-vilkar': '' },
    },
    '/k9/microfrontend/omsorgen-for/**': {
      target: process.env.OMSORGEN_FOR_FRONTEND_URL || 'http://localhost:8282',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/microfrontend/omsorgen-for': '' },
    },
    '/k9/microfrontend/psb-om-barnet/**': {
      target: process.env.PSB_OM_BARNET_FRONTEND_URL || 'http://localhost:8585',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/microfrontend/psb-om-barnet': '' },
    },
    '/k9/microfrontend/psb-etablert-tilsyn/**': {
      target: process.env.PSB_ETABLERT_TILSYN_FRONTEND_URL || 'http://localhost:8484',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/microfrontend/psb-etablert-tilsyn': '' },
    },
    '/k9/microfrontend/psb-uttak/**': {
      target: process.env.PSB_UTTAK_FRONTEND_URL || 'http://localhost:8181',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/microfrontend/psb-uttak': '' },
    },
    '/k9/microfrontend/psb-inntektsmelding/**': {
      target: process.env.PSB_INNTEKTSMELDING_FRONTEND_URL || 'http://localhost:8383',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/microfrontend/psb-inntektsmelding': '' },
    },
    '/k9/endringslogg/**': {
      target: process.env.ENDRINGSLOGG_URL || 'https://familie-endringslogg.dev.intern.nav.no',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/endringslogg': '' },
    },
  },
};
