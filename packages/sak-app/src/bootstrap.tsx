/* eslint-disable @typescript-eslint/no-var-requires */
import { RestApiErrorProvider, RestApiProvider } from '@k9-sak-web/rest-api-hooks';
import { Integrations, init } from '@sentry/browser';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

/**
 * En bug i Chrome gjør at norsk locale ikke blir lastet inn riktig.
 *
 * Se
 * - https://bugs.chromium.org/p/chromium/issues/detail?id=1215606&q=norwegian&can=2
 * - https://github.com/formatjs/formatjs/issues/3066
 */
import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-datetimeformat/locale-data/nb';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-numberformat/locale-data/nb';

import AppIndex from './app/AppIndex';
import configureStore from './configureStore';

/* eslint no-undef: "error" */
// @ts-ignore
const isDevelopment = import.meta.env.DEV;
const environment = window.location.hostname;

init({
  environment,
  dsn: isDevelopment ? 'http://dev@localhost:9000/1' : 'https://251afca29aa44d738b73f1ff5d78c67f@sentry.gc.nav.no/31',
  release: import.meta.env.VITE_SENTRY_RELEASE || 'unknown',
  integrations: [new Integrations.Breadcrumbs({ console: false })],
  beforeSend: (event, hint) => {
    const exception = hint.originalException;
    // @ts-ignore
    if (exception.isAxiosError) {
      // @ts-ignore
      const requestUrl = new URL(exception.request.responseURL);
      // eslint-disable-next-line no-param-reassign
      event.fingerprint = [
        '{{ default }}',
        // @ts-ignore
        String(exception.name),
        // @ts-ignore
        String(exception.message),
        String(requestUrl.pathname),
      ];
      // eslint-disable-next-line no-param-reassign
      event.extra = event.extra ? event.extra : {};
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      event.extra.callId = exception.response.config.headers['Nav-Callid'];
    }
    return event;
  },
});

const store = configureStore();

const renderFunc = Component => {
  /**
   * Redirecte til riktig basename om man kommer hit uten
   * Vil kunne forekomme lokalt og i tester
   */
  if (window.location.pathname === '/') {
    window.location.assign('/k9/web');
  }

  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line global-require
    const { worker } = require('../../mocks/browser');
    worker.start({ onUnhandledRequest: 'bypass' });
  }

  const root = createRoot(app);

  root.render(
    <Provider store={store}>
      <BrowserRouter basename="/k9/web">
        <RestApiProvider>
          <RestApiErrorProvider>
            <Component />
          </RestApiErrorProvider>
        </RestApiProvider>
      </BrowserRouter>
    </Provider>,
  );
};

renderFunc(AppIndex);
