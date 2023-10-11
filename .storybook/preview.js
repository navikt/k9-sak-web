import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-datetimeformat/locale-data/nb';
import '@formatjs/intl-numberformat/locale-data/nb';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import '@fpsak-frontend/assets/styles/global.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';

initialize({ onUnhandledRequest: 'bypass' });

export const loaders = [mswLoader];
export const decorators = [
  Story => (
    <div style={{ margin: '40px' }}>
      <Story />
    </div>
  ),
];
