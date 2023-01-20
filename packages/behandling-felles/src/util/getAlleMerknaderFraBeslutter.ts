import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Behandling, Aksjonspunkt } from '@k9-sak-web/types';

const getAlleMerknaderFraBeslutter = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[]) => {
  if (behandling.status !== behandlingStatus.BEHANDLING_UTREDES) {
    return {};
  }
  return aksjonspunkter.reduce(
    (obj, ap) => ({
      ...obj,
      [ap.definisjon.kode]: {
        notAccepted: ap.toTrinnsBehandling && ap.toTrinnsBehandlingGodkjent === false,
      },
    }),
    {},
  );
};

export default getAlleMerknaderFraBeslutter;
