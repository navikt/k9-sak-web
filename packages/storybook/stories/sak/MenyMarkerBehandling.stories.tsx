import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import MenyMarkerBehandling from '@k9-sak-web/sak-meny-marker-behandling';

import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-meny-marker-behandling',
  component: MenyMarkerBehandling,
  decorators: [withKnobs, withReduxProvider],
};

export const visMenyMarkerBehandlingHastekø = () => (
  <MenyMarkerBehandling behandlingUuid='123' markerBehandling={() => null} brukHastekøMarkering lukkModal={action('button-click')} />
);

export const visMenyMarkerBehandlingVanskeligKø = () => (
  <MenyMarkerBehandling behandlingUuid='123' markerBehandling={() => null} brukVanskeligKøMarkering lukkModal={action('button-click')} />
);
