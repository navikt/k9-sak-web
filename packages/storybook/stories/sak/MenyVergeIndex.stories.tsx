import { action } from '@storybook/addon-actions';
import React from 'react';

import MenyVergeIndex from '@fpsak-frontend/sak-meny-verge';

export default {
  title: 'sak/sak-meny-verge',
  component: MenyVergeIndex,
};

export const visMenyForÅLeggeTilVerge = () => (
  <MenyVergeIndex opprettVerge={action('button-click')} lukkModal={action('button-click')} />
);

export const visMenyForÅFjerneVerge = () => (
  <MenyVergeIndex fjernVerge={action('button-click')} lukkModal={action('button-click')} />
);
