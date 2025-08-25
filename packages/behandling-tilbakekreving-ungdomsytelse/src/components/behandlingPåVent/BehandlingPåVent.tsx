import { aksjonspunktCodes } from '@k9-sak-web/backend/ungtilbake/kodeverk/AksjonspunktCodes.js';
import SettPåVentModal from '@k9-sak-web/gui/shared/settPåVentModal/SettPåVentModal.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { goToLos } from '@k9-sak-web/lib/paths/paths.js';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
interface SettPaVentParams {
  formData: {
    ventearsak: string;
    frist?: string;
  };
  behandlingId: number;
  behandlingVersjon: number;
}

interface BehandlingPaVentProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  settPaVent: (params: SettPaVentParams) => Promise<any>;
}

const BehandlingPaVent = ({ behandling, aksjonspunkter, settPaVent }: BehandlingPaVentProps) => {
  const [skalViseModal, setVisModal] = useState(behandling.behandlingPåVent);
  const skjulModal = useCallback(() => setVisModal(false), []);

  useEffect(() => {
    setVisModal(behandling.behandlingPåVent);
  }, [behandling.behandlingPåVent]);

  const oppdaterPaVentData = useCallback(
    formData =>
      settPaVent({
        ...formData,
        behandlingId: behandling.id,
        behandlingVersjon: behandling.versjon,
      }).then(() => goToLos()),
    [behandling.id, behandling.versjon, settPaVent],
  );

  const erManueltSattPaVent = useMemo(
    () =>
      aksjonspunkter?.some(
        ap =>
          isAksjonspunktOpen(`${ap.status}`) && ap.definisjon.kode === aksjonspunktCodes.VENT_PÅ_BRUKERTILBAKEMELDING,
      ) ?? false,
    [aksjonspunkter],
  );

  if (!skalViseModal) {
    return null;
  }

  return (
    <SettPåVentModal
      submitCallback={oppdaterPaVentData}
      cancelEvent={skjulModal}
      frist={behandling.fristBehandlingPåVent}
      ventearsak={behandling.venteÅrsakKode}
      hasManualPaVent={erManueltSattPaVent}
      erTilbakekreving
      showModal
    />
  );
};

export default BehandlingPaVent;
