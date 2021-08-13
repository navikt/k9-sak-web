import React, { useState, useMemo, useCallback, FunctionComponent, useEffect } from 'react';

import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Behandling, Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';

import SettPaVentParams from '../../types/settPaVentParamsTsType';

interface BehandlingPaVentProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, keepData: boolean) => Promise<any>;
  erTilbakekreving?: boolean;
}

const BehandlingPaVent: FunctionComponent<BehandlingPaVentProps> = ({
  behandling,
  aksjonspunkter,
  kodeverk,
  settPaVent,
  hentBehandling,
  erTilbakekreving,
}) => {
  const [skalViseModal, setVisModal] = useState(behandling.behandlingPaaVent);
  const skjulModal = useCallback(() => setVisModal(false), []);

  useEffect(() => {
    setVisModal(behandling.behandlingPaaVent);
  }, [behandling.versjon]);

  const oppdaterPaVentData = useCallback(
    formData =>
      settPaVent({
        ...formData,
        behandlingId: behandling.id,
        behandlingVersjon: behandling.versjon,
      }).then(() => hentBehandling({ behandlingId: behandling.id }, false)),
    [behandling.versjon],
  );

  const erManueltSattPaVent = useMemo(
    () =>
      aksjonspunkter
        .filter(ap => isAksjonspunktOpen(ap.status.kode))
        .some(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
    [aksjonspunkter],
  );

  if (!skalViseModal) {
    return null;
  }

  return (
    <SettPaVentModalIndex
      submitCallback={oppdaterPaVentData}
      cancelEvent={skjulModal}
      frist={behandling.fristBehandlingPaaVent}
      ventearsak={behandling.venteArsakKode}
      hasManualPaVent={erManueltSattPaVent}
      ventearsaker={kodeverk[kodeverkTyper.VENT_AARSAK]}
      erTilbakekreving={erTilbakekreving}
      showModal
    />
  );
};

BehandlingPaVent.defaultProps = {
  erTilbakekreving: false,
};

export default BehandlingPaVent;
