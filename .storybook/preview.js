import React from 'react';
import '@fpsak-frontend/assets/styles/global.less';

export const decorators = [
  Story => (
    <div style={{ margin: '40px' }}>
      <Story />
    </div>
  ),
];
