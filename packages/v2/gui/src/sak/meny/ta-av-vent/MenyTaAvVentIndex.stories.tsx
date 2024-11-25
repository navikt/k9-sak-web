import { action } from '@storybook/addon-actions';
import MenyTaAvVentIndexV2 from './MenyTaAvVentIndex';

export default {
  title: 'gui/sak/meny/ta-av-vent',
  component: MenyTaAvVentIndexV2,
};

export const visMenyForÅTaBehandlingAvVent = () => (
  <MenyTaAvVentIndexV2
    behandlingId={1}
    behandlingVersjon={2}
    taBehandlingAvVent={action('button-click')}
    lukkModal={action('button-click')}
  />
);
