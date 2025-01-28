import { action } from '@storybook/addon-actions';
import { asyncAction } from '../../../storybook/asyncAction';
import MenyMarkerBehandlingV2 from './MenyMarkerBehandling';

export default {
  title: 'gui/sak/meny/marker-behandling',
  component: MenyMarkerBehandlingV2,
};

export const visMenyMarkerBehandlingHastekø = () => (
  <MenyMarkerBehandlingV2
    behandlingUuid="123"
    markerBehandling={asyncAction('button-click')}
    brukHastekøMarkering
    lukkModal={action('button-click')}
    merknaderFraLos={{}}
  />
);

export const visMenyMarkerBehandlingVanskeligKø = () => (
  <MenyMarkerBehandlingV2
    behandlingUuid="123"
    markerBehandling={asyncAction('button-click')}
    brukVanskeligKøMarkering
    lukkModal={action('button-click')}
    merknaderFraLos={{}}
  />
);
