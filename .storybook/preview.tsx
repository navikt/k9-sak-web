import '@fpsak-frontend/assets/styles/global.css';
import { switchOnTestMode } from '@k9-sak-web/rest-api';
import configureStore from '@k9-sak-web/sak-app/src/configureStore';
import '@navikt/ds-css/darkside';
import { Theme } from '@navikt/ds-react/Theme';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureK9SakClient } from '@k9-sak-web/backend/k9sak/configureK9SakClient.js';
import { configureK9KlageClient } from '@k9-sak-web/backend/k9klage/configureK9KlageClient.js';
import { configureK9TilbakeClient } from '@k9-sak-web/backend/k9tilbake/configureK9TilbakeClient.js';

const { VITE_LOCAL_STORYBOOK } = import.meta.env;

switchOnTestMode();

// Mock AuthFixApi for Storybook
const mockAuthFixer = {
  authenticate: async () => ({ isAuthenticated: true, popupClosed: true, aborted: false as const }),
  shouldWaitForAuthentication: false,
  authenticationDone: async () => {},
};

// Configure backend clients for Storybook
configureK9SakClient(mockAuthFixer as any);
configureK9KlageClient(mockAuthFixer as any);
configureK9TilbakeClient(mockAuthFixer as any);

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: VITE_LOCAL_STORYBOOK ? '/mockServiceWorker.js' : '/k9-sak-web/mockServiceWorker.js',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const preview: Preview = {
  parameters: {
    margin: '40px',
  },
  decorators: [
    Story => {
      const store = configureStore();
      return (
        <Provider store={store}>
          <MemoryRouter>
            <QueryClientProvider client={queryClient}>
              <Theme theme="light">
                <Story />
              </Theme>
            </QueryClientProvider>
          </MemoryRouter>
        </Provider>
      );
    },
    // Decorator som legger på ekstra margin. Kan overstyrast med parameter på komponentnivå/enkeltstories ved behov.
    // Feks viss ein lager stories for komponenter som skal vise på toppnivå på sida kan det vere lurt å sette parameter
    // layout: "fullscreen", som også fjerner margin her.
    (Story, { parameters }) => {
      return parameters.margin !== null && parameters.layout !== 'fullscreen' ? (
        <div style={{ margin: parameters.margin }}>
          <Story />
        </div>
      ) : (
        <Story />
      );
    },
  ],
  loaders: [
    async context => {
      await mswLoader(context);
      await waitForActivatedServiceWorker();
    },
  ],
};

const waitForActivatedServiceWorker = async () => {
  // Wait for the worker to be loaded
  const serviceWorker =
    navigator.serviceWorker.controller ||
    (await new Promise((resolve, reject) => {
      let triesLeft = 10;

      const fn = () => {
        if (navigator.serviceWorker.controller) {
          resolve(navigator.serviceWorker.controller);
        } else {
          triesLeft -= 1;

          if (triesLeft === 0) {
            reject(new Error('Timed out waiting for service worker'));
          } else {
            setTimeout(fn, 100);
          }
        }
      };

      setTimeout(fn, 100);
    }));

  if (!serviceWorker) {
    throw new Error('No service worker found');
  }

  // Make sure the worker is actually ready to go
  if (serviceWorker.state !== 'activated') {
    await new Promise<void>(resolve => {
      const fn = (e: Event) => {
        if (e.target && 'state' in e.target && e.target.state === 'activated') {
          serviceWorker.removeEventListener('statechange', fn);
          resolve();
        }
      };

      serviceWorker.addEventListener('statechange', fn);
    });
  }
};

export default preview;
