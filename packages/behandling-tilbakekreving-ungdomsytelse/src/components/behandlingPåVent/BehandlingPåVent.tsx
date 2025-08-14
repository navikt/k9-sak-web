import {
  type sif_tilbakekreving_web_app_tjenester_behandling_aksjonspunkt_dto_AksjonspunktDto as AksjonspunktDto,
  type sif_tilbakekreving_web_app_tjenester_behandling_dto_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungtilbake/kodeverk/AksjonspunktCodes.js';
import SettPåVentModal from '@k9-sak-web/gui/shared/settPåVentModal/SettPåVentModal.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { goToLos } from '@k9-sak-web/lib/paths/paths.js';
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
  behandling: BehandlingDto;
  aksjonspunkter: AksjonspunktDto[];
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
      (aksjonspunkter || [])
        .filter(ap => isAksjonspunktOpen(`${ap.status}`))
        .some(ap => ap.definisjon === aksjonspunktCodes.VENT_PÅ_BRUKERTILBAKEMELDING),
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
