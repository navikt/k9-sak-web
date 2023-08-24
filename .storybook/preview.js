import '@formatjs/intl-datetimeformat/locale-data/nb';
import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-numberformat/locale-data/nb';
import '@formatjs/intl-numberformat/polyfill-force';
import '@fpsak-frontend/assets/styles/global.less';
import React from 'react';

export const decorators = [
  Story => (
    <div style={{ margin: '40px' }}>
      <Story />
    </div>
  ),
];
