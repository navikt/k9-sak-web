import '@fpsak-frontend/assets/styles/global.css';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';

initialize({ onUnhandledRequest: 'bypass' });

export const loaders = [mswLoader];
const preview: Preview = {
  decorators: [
    Story => (
      <div style={{ margin: '40px' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
