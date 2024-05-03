import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import MenyTaAvVentIndex from '@k9-sak-web/sak-meny-ta-av-vent';

export default {
  title: 'sak/sak-meny-ta-av-vent',
  component: MenyTaAvVentIndex,
  decorators: [withKnobs],
};

export const visMenyForÅTaBehandlingAvVent = () => (
  <MenyTaAvVentIndex
    behandlingId={1}
    behandlingVersjon={2}
    taBehandlingAvVent={action('button-click')}
    lukkModal={action('button-click')}
  />
);
