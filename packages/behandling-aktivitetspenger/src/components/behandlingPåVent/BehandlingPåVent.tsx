import { aksjonspunktCodes } from '@k9-sak-web/backend/ungtilbake/kodeverk/AksjonspunktCodes.js';
import SettPåVentModal from '@k9-sak-web/gui/shared/settPåVentModal/SettPåVentModal.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { goToSearch } from '@k9-sak-web/lib/paths/paths.js';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { ung_sak_kontrakt_behandling_BehandlingDto } from '@navikt/ung-sak-typescript-client/types';
import { useCallback, useMemo, useState } from 'react';
interface SettPaVentParams {
  formData: {
    ventearsak: string;
    frist?: string;
  };
  behandlingId: number;
  behandlingVersjon: number;
}

interface BehandlingPaVentProps {
  behandling: Pick<
    ung_sak_kontrakt_behandling_BehandlingDto,
    'id' | 'versjon' | 'uuid' | 'fristBehandlingPåVent' | 'venteÅrsakKode' | 'behandlingPåVent'
  >;
  aksjonspunkter: Aksjonspunkt[];
  settPaVent: (params: SettPaVentParams) => Promise<any>;
}

export const BehandlingPåVent = ({ behandling, aksjonspunkter, settPaVent }: BehandlingPaVentProps) => {
  const [skalViseModal, setVisModal] = useState(behandling.behandlingPåVent);
  const skjulModal = useCallback(() => setVisModal(false), []);

  const oppdaterPaVentData = useCallback(
    formData =>
      settPaVent({
        ...formData,
        behandlingId: behandling.id,
        behandlingVersjon: behandling.versjon,
        behandlingUuid: behandling.uuid,
      }).then(() => goToSearch()),
    [behandling.id, behandling.uuid, behandling.versjon, settPaVent],
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
      erTilbakekreving={false}
      erKlage={false}
      showModal
      navigerEtterEndreFrist={goToSearch}
    />
  );
};
