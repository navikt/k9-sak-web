import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';
import { init, Integrations } from '@sentry/browser';

// Bug i chrome 92 gjør at disse må polyfilles...
// Se https://bugs.chromium.org/p/chromium/issues/detail?id=1215606&q=norwegian&can=2
// Og https://github.com/formatjs/formatjs/issues/3066 for mer info.
import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-datetimeformat/locale-data/nb';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-numberformat/locale-data/nb';

import { RestApiErrorProvider, RestApiProvider } from '@k9-sak-web/rest-api-hooks';
import AppIndex from './app/AppIndex';
import configureStore from './configureStore';

/* eslint no-undef: "error" */
// @ts-ignore
const isDevelopment = process.env.NODE_ENV === 'development';
const environment = window.location.hostname;

init({
  environment,
  dsn: isDevelopment ? 'http://dev@localhost:9000/1' : 'https://251afca29aa44d738b73f1ff5d78c67f@sentry.gc.nav.no/31',
  release: '1', // TODO endre denne til å bli satt av github actions
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

const history = createBrowserHistory({
  basename: '/k9/web/',
});
const store = configureStore();

const renderFunc = Component => {
  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }
  render(
    <Provider store={store}>
      <Router history={history}>
        <RestApiProvider>
          <RestApiErrorProvider>
            <Component />
          </RestApiErrorProvider>
        </RestApiProvider>
      </Router>
    </Provider>,
    app,
  );
};

renderFunc(AppIndex);
