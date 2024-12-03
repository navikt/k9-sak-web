/* eslint-disable @typescript-eslint/no-var-requires */
import { RestApiErrorProvider, RestApiProvider } from '@k9-sak-web/rest-api-hooks';
import { init } from '@sentry/browser';
import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

import { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';
import AppIndex from './app/AppIndex';
import configureStore from './configureStore';
import { IS_DEV, VITE_SENTRY_RELEASE } from './constants';

import { isAlertInfo } from '@k9-sak-web/gui/app/alerts/AlertInfo.js';
import { AxiosError } from 'axios';

/* eslint no-undef: "error" */
const isDevelopment = IS_DEV;
const environment = window.location.hostname;

init({
  environment,
  dsn: isDevelopment ? 'http://dev@localhost:9000/1' : 'https://251afca29aa44d738b73f1ff5d78c67f@sentry.gc.nav.no/31',
  release: VITE_SENTRY_RELEASE || 'unknown',
  // tracesSampleRate: isDevelopment ? 1.0 : 0.5, // Consider adjusting this in production
  tracesSampleRate: 1.0,
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
    try {
      event.extra = event.extra || {};
      const exception = hint.originalException;
      if (exception instanceof AxiosError) {
        const requestUrl = new URL(exception.request.responseURL);
        event.fingerprint = [
          '{{ default }}',
          String(exception.name),
          String(exception.message),
          String(requestUrl.pathname),
        ];
        event.extra.callId = exception.response.config.headers['Nav-Callid'];
      } else if (exception instanceof ExtendedApiError) {
        event.fingerprint = ['{{ default }}', exception.name, exception.statusText, exception.url];
        event.extra.callId = exception.navCallid;
      }
      // For alle Error typer som implementerer AlertInfo tek vi med errorId i sentry rapport.
      if (isAlertInfo(exception)) {
        event.extra.errorId = `${exception.errorId}`;
      }
    } catch (e) {
      try {
        event.exception.values.push(e);
        console.error('Sentry beforeSend failure. Will send the original event with extra error attached', e);
      } catch (e2) {
        console.error(
          'Sentry beforeSend failure. Will send the original event. Attaching of extra error also failed',
          e,
          e2,
        );
      }
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
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === 'test') {
      const { worker } = await import('../../mocks/browser');
      worker.start({ onUnhandledRequest: 'bypass' });
    }
  };

  prepare().then(() => {
    const root = createRoot(app);
    root.render(
      <Provider store={store}>
        <BrowserRouter
          basename="/k9/web"
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
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
