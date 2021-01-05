import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import MenyVergeIndex from '@fpsak-frontend/sak-meny-verge';

export default {
  title: 'sak/sak-meny-verge',
  component: MenyVergeIndex,
  decorators: [withKnobs],
};

export const visMenyForÅLeggeTilVerge = () => (
  <MenyVergeIndex opprettVerge={action('button-click')} lukkModal={action('button-click')} />
);

export const visMenyForÅFjerneVerge = () => (
  <MenyVergeIndex fjernVerge={action('button-click')} lukkModal={action('button-click')} />
);
