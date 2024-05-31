import { action } from '@storybook/addon-actions';
import React from 'react';
import MenyMarkerBehandling from './MenyMarkerBehandling';

export default {
  title: 'sak/sak-meny-marker-behandling',
  component: MenyMarkerBehandling,
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
