import '@fpsak-frontend/assets/styles/global.css';
import configureStore from '@k9-sak-web/sak-app/src/configureStore';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

// @ts-ignore
const { VITE_LOCAL_STORYBOOK } = import.meta.env;

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: VITE_LOCAL_STORYBOOK ? '/mockServiceWorker.js' : '/k9-sak-web/mockServiceWorker.js',
  },
});

const preview: Preview = {
  decorators: [
    Story => {
      const store = configureStore();
      return (
        <Provider store={store}>
          <MemoryRouter>
            <div style={{ margin: '40px' }}>
              <Story />
            </div>
          </MemoryRouter>
        </Provider>
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
