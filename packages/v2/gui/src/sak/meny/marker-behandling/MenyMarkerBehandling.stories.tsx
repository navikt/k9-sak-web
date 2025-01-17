import { action } from '@storybook/addon-actions';
import MenyMarkerBehandlingV2 from './MenyMarkerBehandling';

export default {
  title: 'gui/sak/meny/marker-behandling',
  component: MenyMarkerBehandlingV2,
};

export const visMenyMarkerBehandlingHastekø = () => (
  <MenyMarkerBehandlingV2
    behandlingUuid="123"
    markerBehandling={() => null}
    brukHastekøMarkering
    lukkModal={action('button-click')}
    merknaderFraLos={null}
  />
);

export const visMenyMarkerBehandlingVanskeligKø = () => (
  <MenyMarkerBehandlingV2
    behandlingUuid="123"
    markerBehandling={() => null}
    brukVanskeligKøMarkering
    lukkModal={action('button-click')}
    merknaderFraLos={null}
  />
);
