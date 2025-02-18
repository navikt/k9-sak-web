import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingDtoStatus, BehandlingDtoType, BehandlingsresultatDtoType } from '@navikt/k9-sak-typescript-client';
import { action } from '@storybook/addon-actions';
import FatterVedtakTotrinnskontrollModalSakIndex from './FatterVedtakTotrinnskontrollModalSakIndex';

export default {
  title: 'gui/sak/totrinnskontroll/fatter-vedtak-modal',
  component: FatterVedtakTotrinnskontrollModalSakIndex,
};

const behandling = {
  id: 1,
  status: BehandlingDtoStatus.FATTER_VEDTAK,
  type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
  behandlingsresultat: {
    type: BehandlingsresultatDtoType.OPPHØR,
  },
  toTrinnsBehandling: false,
};

export const visModalEtterGodkjenning = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={behandling}
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={false}
  />
);

export const visModalEtterGodkjenningAvKlage = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={{
      ...behandling,
      type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
    }}
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={false}
  />
);

export const visModalEtterTilbakesendingTilSaksbehandler = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={behandling}
    closeEvent={action('button-click')}
    allAksjonspunktApproved={false}
    fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={false}
  />
);
