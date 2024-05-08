import { action } from '@storybook/addon-actions';
import React from 'react';

import MenyMarkerBehandling from '@k9-sak-web/sak-meny-marker-behandling';

import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-meny-marker-behandling',
  component: MenyMarkerBehandling,
  decorators: [withReduxProvider],
};

export const visMenyMarkerBehandlingHastekø = () => (
  <MenyMarkerBehandling
    behandlingUuid="123"
    markerBehandling={() => null}
    brukHastekøMarkering
    lukkModal={action('button-click')}
    merknaderFraLos={null}
  />
);

export const visMenyMarkerBehandlingVanskeligKø = () => (
  <MenyMarkerBehandling
    behandlingUuid="123"
    markerBehandling={() => null}
    brukVanskeligKøMarkering
    lukkModal={action('button-click')}
    merknaderFraLos={null}
  />
);
