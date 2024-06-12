import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';
import { goToLos } from '@k9-sak-web/sak-app/src/app/paths';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import SettPaVentParams from '../../types/settPaVentParamsTsType';

interface BehandlingPaVentProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  kodeverk: AlleKodeverk;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  erTilbakekreving?: boolean;
}

const BehandlingPaVent = ({
  behandling,
  aksjonspunkter,
  kodeverk,
  settPaVent,
  erTilbakekreving = false,
}: BehandlingPaVentProps) => {
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
      }).then(() => goToLos()),
    [behandling.versjon],
  );

  const erManueltSattPaVent = useMemo(
    () =>
      (aksjonspunkter || [])
        .filter(ap => isAksjonspunktOpen(ap.status))
        .some(ap => ap.definisjon === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
    [aksjonspunkter],
  );

  const ventearsakVariant = useMemo(
    () =>
      (aksjonspunkter || [])
        .filter(ap => isAksjonspunktOpen(ap.status))
        .find(ap => ap.definisjon === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT)?.venteårsakVariant,
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
      erTilbakekreving={erTilbakekreving}
      ventearsakVariant={ventearsakVariant}
      showModal
    />
  );
};

export default BehandlingPaVent;
