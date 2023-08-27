import '@formatjs/intl-datetimeformat/locale-data/nb';
import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-numberformat/locale-data/nb';
import '@formatjs/intl-numberformat/polyfill-force';
import '@fpsak-frontend/assets/styles/global.less';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';

initialize();

export const loaders = [mswLoader];
export const decorators = [
  Story => (
    <div style={{ margin: '40px' }}>
      <Story />
    </div>
  ),
];
