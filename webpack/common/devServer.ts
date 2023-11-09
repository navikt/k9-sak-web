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
    '/k9/endringslogg/**': {
      target: process.env.ENDRINGSLOGG_URL || 'https://familie-endringslogg.intern.dev.nav.no',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/k9/endringslogg': '' },
    },
  },
};
