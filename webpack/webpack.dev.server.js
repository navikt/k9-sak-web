'use strict';
require('dotenv').config();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev');
const vtpLogin = require('./mocks/login');
const sentryMock = require('./mocks/sentry');
const featureToggles = require('./mocks/feature-toggles');
const fakeError = require('./mocks/fake-error');
if (process.argv.includes('--no-fix')) {
  console.warn("Setting eslint-loader option 'fix' to false");
  config.module.rules.find(rules => rules.loader === 'eslint-loader').options.fix = false;
}

const options = {
  contentBase: ['packages'],
  watchContentBase: true,
  before: function (app, server) {
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
    '/k9/diagnosekoder': {
      target: process.env.APP_URL_DIAGNOSEKODER || 'http://localhost:8300',
      pathRewrite: {
        '^/k9': '',
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
  },
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
  historyApiFallback: {
    index: '/k9/web/',
  },
  stats: {
    children: false,
    colors: true,
  },
};

const wds = new WebpackDevServer(webpack(config), options);

wds.listen(9000, 'localhost', function (err) {
  if (err) {
    return console.log(err); // NOSONAR
  }
  console.log('Listening at http://localhost:9000/');

  console.log('If running against VTP you can login or change user here: http://localhost:9000/login-with-vtp');
});
