import '@fpsak-frontend/assets/styles/global.css';
import configureStore from '@k9-sak-web/sak-app/src/configureStore';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { Preview } from '@storybook/react';
import { getWorker, initialize, mswLoader } from 'msw-storybook-addon';
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
  loaders: [mswLoader, () => getWorker().start()],
};

export default preview;
