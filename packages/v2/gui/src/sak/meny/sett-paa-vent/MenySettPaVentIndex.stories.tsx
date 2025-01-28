import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { action } from '@storybook/addon-actions';
import { asyncAction } from '../../../storybook/asyncAction';
import MenySettPaVentIndexV2 from './MenySettPaVentIndex';

export default {
  title: 'gui/sak/meny/sett-pa-vent',
  component: MenySettPaVentIndexV2,
};

export const visMenyForÅSetteBehandlingPåVent = () => (
  <KodeverkProvider
    behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <MenySettPaVentIndexV2
      behandlingId={1}
      behandlingVersjon={2}
      settBehandlingPaVent={asyncAction('button-click')}
      lukkModal={action('button-click')}
      erTilbakekreving={false}
    />
  </KodeverkProvider>
);
