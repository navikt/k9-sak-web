import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';

import configureStore from './configureStore';
import { IS_DEV, VITE_SENTRY_RELEASE } from './constants';
import { isQ } from '@k9-sak-web/lib/paths/paths.js';

import { configureK9KlageClient } from '@k9-sak-web/backend/k9klage/configureK9KlageClient.js';
import { configureK9SakClient } from '@k9-sak-web/backend/k9sak/configureK9SakClient.js';
import { configureK9TilbakeClient } from '@k9-sak-web/backend/k9tilbake/configureK9TilbakeClient.js';
import { RootLayout } from '@k9-sak-web/gui/app/root/RootLayout.js';
import { AuthRedirectDoneWindow, authRedirectDoneWindowPath } from '@k9-sak-web/gui/app/auth/AuthRedirectDoneWindow.js';
import AppIndex from './app/AppIndex';
import { RestApiProviderLayout } from './app/RestApiProviderLayout.js';
import { AuthFixer } from '@k9-sak-web/gui/app/auth/AuthFixer.js';
import { sequentialAuthFixerSetup } from '@k9-sak-web/gui/app/auth/WaitsForOthersAuthFixer.js';
import { resolveK9FeatureToggles } from '@k9-sak-web/gui/featuretoggles/k9/resolveK9FeatureToggles.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { initSentry } from '@k9-sak-web/gui/app/errorhandling/sentry.js';

initSentry({
  dsn: 'https://251afca29aa44d738b73f1ff5d78c67f@sentry.gc.nav.no/31',
  enabled: !IS_DEV,
  release: VITE_SENTRY_RELEASE || 'unknown',
});

const featureToggles = resolveK9FeatureToggles({ useQVersion: IS_DEV || isQ() });

const basePath = '/k9/web';

if (featureToggles.SINGLE_AUTHFIXER) {
  const authFixer = new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'k9-alle');
  configureK9SakClient(authFixer);
  configureK9KlageClient(authFixer);
  configureK9TilbakeClient(authFixer);
} else {
  const [sakAuthFixer, klageAuthFixer, tilbakeAuthFixer] = sequentialAuthFixerSetup(
    // Vi må ha ein unik AuthFixer instans pr backend
    new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'k9-sak'),
    new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'k9-klage'),
    new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'k9-tilbake'),
  );
  configureK9SakClient(sakAuthFixer);
  configureK9KlageClient(klageAuthFixer);
  configureK9TilbakeClient(tilbakeAuthFixer);
}

const store = configureStore();

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const renderFunc = () => {
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
      await worker.start({ onUnhandledRequest: 'bypass' });
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
