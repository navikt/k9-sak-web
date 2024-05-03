import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';

const getAlleMerknaderFraBeslutter = (behandling: Behandling, aksjonspunkter: Aksjonspunkt[]) => {
  if (behandling.status.kode !== behandlingStatus.BEHANDLING_UTREDES) {
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
