import { action } from 'storybook/actions';
import MenyTaAvVentIndex from './MenyTaAvVentIndex';

export default {
  title: 'sak/sak-meny-ta-av-vent',
  component: MenyTaAvVentIndex,
};

export const visMenyForÅTaBehandlingAvVent = () => (
  <MenyTaAvVentIndex
    behandlingId={1}
    behandlingVersjon={2}
    taBehandlingAvVent={action('button-click')}
    lukkModal={action('button-click')}
  />
);
