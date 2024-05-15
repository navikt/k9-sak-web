import '@fpsak-frontend/assets/styles/global.css';
import configureStore from '@k9-sak-web/sak-app/src/configureStore';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: '/public/mockServiceWorker.js',
  },
});

export const loaders = [mswLoader];
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
};

export default preview;
