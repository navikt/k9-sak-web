import { init } from '@sentry/browser';
import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router';

import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';

import { IS_DEV, VITE_SENTRY_RELEASE } from './constants';
import { isQ } from '@k9-sak-web/lib/paths/paths.js';

import { isAlertInfo } from '@k9-sak-web/gui/app/alerts/AlertInfo.js';
import configureStore from '@k9-sak-web/sak-app/src/configureStore';
import { AxiosError } from 'axios';
import AppIndex from './app/AppIndex';
import { configureUngSakClient } from '@k9-sak-web/backend/ungsak/configureUngSakClient.js';
import { RootLayout } from '@k9-sak-web/gui/app/root/RootLayout.js';
import { AuthRedirectDoneWindow, authRedirectDoneWindowPath } from '@k9-sak-web/gui/app/auth/AuthRedirectDoneWindow.js';
import { RestApiProviderLayout } from '@k9-sak-web/sak-app/src/app/RestApiProviderLayout.js';
import { AuthFixer } from '@k9-sak-web/gui/app/auth/AuthFixer.js';
import { sequentialAuthFixerSetup } from '@k9-sak-web/gui/app/auth/WaitsForOthersAuthFixer.js';
import { configureUngTilbakeClient } from '@k9-sak-web/backend/ungtilbake/configureUngTilbakeClient.js';
import { resolveUngFeatureToggles } from '@k9-sak-web/gui/featuretoggles/ung/resolveUngFeatureToggles.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';

const environment = window.location.hostname;

init({
  environment,
  dsn: 'https://e0b47ccba910402c81fcae9bf04d2427@sentry.gc.nav.no/176',
  enabled: !IS_DEV,
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
        event.extra.callId = exception?.response?.config.headers['Nav-Callid'];
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
        if (event.exception?.values != null) {
          event.exception.values.push(e);
        }
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

const featureToggles = resolveUngFeatureToggles({ useQVersion: IS_DEV || isQ() });

const basePath = '/ung/web';
const [sakAuthFixer, tilbakeAuthFixer] = sequentialAuthFixerSetup(
  // Vi må ha ein unik AuthFixer instans pr backend
  new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'ung-sak'),
  new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'ung-tilbake'),
);
configureUngSakClient(sakAuthFixer);
configureUngTilbakeClient(tilbakeAuthFixer);

const store = configureStore();

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const renderFunc = () => {
  /**
   * Redirecte til riktig basename om man kommer hit uten
   * Vil kunne forekomme lokalt og i tester
   */
  if (window.location.pathname === '/') {
    window.location.assign(basePath);
  }

  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }

  const prepare = async (): Promise<void> => {
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === 'test') {
      const { worker } = await import('../../mocks/browser');
      void worker.start({ onUnhandledRequest: 'bypass' });
    }
  };

  const run = () => {
    const root = createRoot(app);
    root.render(
      <FeatureTogglesContext value={featureToggles}>
        <Provider store={store}>
          <BrowserRouter basename={basePath}>
            <SentryRoutes>
              <Route element={<RootLayout />}>
                <Route path={authRedirectDoneWindowPath} element={<AuthRedirectDoneWindow />} />
                <Route element={<RestApiProviderLayout />}>
                  <Route path="*" element={<AppIndex />} />
                </Route>
              </Route>
            </SentryRoutes>
          </BrowserRouter>
        </Provider>
      </FeatureTogglesContext>,
    );
  };
  prepare()
    .then(run)
    .catch(err => {
      console.error(`bootstrap prepare failed, will start running anyways`, err);
      run();
    });
};

renderFunc();
