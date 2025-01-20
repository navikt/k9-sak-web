import { action } from '@storybook/addon-actions';
import { asyncAction } from '../../../storybook/asyncAction';
import MenySettPaVentIndexV2 from './MenySettPaVentIndex';

export default {
  title: 'gui/sak/meny/sett-pa-vent',
  component: MenySettPaVentIndexV2,
};

export const visMenyForÅSetteBehandlingPåVent = () => (
  <MenySettPaVentIndexV2
    behandlingId={1}
    behandlingVersjon={2}
    settBehandlingPaVent={asyncAction('button-click')}
    lukkModal={action('button-click')}
    erTilbakekreving={false}
  />
);
