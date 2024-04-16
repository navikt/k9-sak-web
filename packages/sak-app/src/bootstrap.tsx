/* eslint-disable @typescript-eslint/no-var-requires */
import { RestApiErrorProvider, RestApiProvider } from '@k9-sak-web/rest-api-hooks';
import { init } from '@sentry/browser';
import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

import AppIndex from './app/AppIndex';
import configureStore from './configureStore';
import { IS_DEV, VITE_SENTRY_RELEASE } from './constants';

/* eslint no-undef: "error" */
// @ts-ignore
const isDevelopment = IS_DEV;
const environment = window.location.hostname;

init({
  environment,
  dsn: isDevelopment ? 'http://dev@localhost:9000/1' : 'https://251afca29aa44d738b73f1ff5d78c67f@sentry.gc.nav.no/31',
  release: VITE_SENTRY_RELEASE || 'unknown',
  tracesSampleRate: isDevelopment ? 1.0 : 0.5, // Consider adjusting this in production
  integrations: [
    Sentry.breadcrumbsIntegration({ console: false }),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
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

  const prepare = async (): Promise<void> => {
    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line import/no-relative-packages
      const { worker } = await import('../../mocks/browser');
      worker.start({ onUnhandledRequest: 'bypass' });
    }
  };

  prepare().then(() => {
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
  });
};

renderFunc(AppIndex);
