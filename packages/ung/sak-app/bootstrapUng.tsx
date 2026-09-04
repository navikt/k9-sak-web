import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';

import { IS_DEV } from './constants';
import { isQ } from '@k9-sak-web/lib/paths/paths.js';

import configureStore from '@k9-sak-web/sak-app/src/configureStore';
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
import { initApm } from '@k9-sak-web/gui/app/errorhandling/apm.js';

initApm({ app: 'ung-sak-web' });

const featureToggles = resolveUngFeatureToggles({ useQVersion: IS_DEV || isQ() });

const basePath = '/ung/web';
if (featureToggles.SINGLE_AUTHFIXER) {
  const authFixer = new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'ung-alle');
  configureUngSakClient(authFixer);
  configureUngTilbakeClient(authFixer);
} else {
  const [sakAuthFixer, tilbakeAuthFixer] = sequentialAuthFixerSetup(
    // Vi må ha ein unik AuthFixer instans pr backend
    new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'ung-sak'),
    new AuthFixer(`${basePath}${authRedirectDoneWindowPath}`, 'ung-tilbake'),
  );
  configureUngSakClient(sakAuthFixer);
  configureUngTilbakeClient(tilbakeAuthFixer);
}

const store = configureStore();

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
            <Routes>
              <Route element={<RootLayout />}>
                <Route path={authRedirectDoneWindowPath} element={<AuthRedirectDoneWindow />} />
                <Route element={<RestApiProviderLayout />}>
                  <Route path="*" element={<AppIndex />} />
                </Route>
              </Route>
            </Routes>
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
