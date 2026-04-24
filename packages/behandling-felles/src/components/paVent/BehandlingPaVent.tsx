import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { isUngWeb } from '@k9-sak-web/gui/utils/urlUtils.js';
import { goToLos, goToSearch } from '@k9-sak-web/lib/paths/paths.js';
import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';
import { Aksjonspunkt, Behandling, Venteaarsak } from '@k9-sak-web/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SettPaVentParams from '../../types/settPaVentParamsTsType';

interface BehandlingPaVentProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  kodeverk: { [key: string]: Venteaarsak[] };
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
  const [skalViseModal, setVisModal] = useState(behandling.behandlingPåVent);
  const skjulModal = useCallback(() => setVisModal(false), []);

  useEffect(() => {
    setVisModal(behandling.behandlingPåVent);
  }, [behandling.versjon]);

  const oppdaterPaVentData = useCallback(
    formData =>
      settPaVent({
        ...formData,
        behandlingId: behandling.id,
        behandlingVersjon: behandling.versjon,
      }).then(() => {
        if (isUngWeb()) {
          goToSearch();
        }
        goToLos();
      }),
    [behandling.versjon, settPaVent, behandling.id],
  );

  const erManueltSattPaVent = useMemo(
    () =>
      (aksjonspunkter || [])
        .filter(ap => isAksjonspunktOpen(ap.status.kode))
        .some(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT),
    [aksjonspunkter],
  );

  const ventearsakVariant = useMemo(
    () =>
      (aksjonspunkter || [])
        .filter(ap => isAksjonspunktOpen(ap.status.kode))
        .find(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT)?.venteårsakVariant,
    [aksjonspunkter],
  );

  if (!skalViseModal) {
    return null;
  }

  return (
    <SettPaVentModalIndex
      submitCallback={oppdaterPaVentData}
      cancelEvent={skjulModal}
      frist={behandling.fristBehandlingPåVent}
      ventearsak={behandling.venteÅrsakKode}
      hasManualPaVent={erManueltSattPaVent}
      ventearsaker={kodeverk[kodeverkTyper.VENT_AARSAK]}
      erTilbakekreving={erTilbakekreving}
      ventearsakVariant={ventearsakVariant}
      showModal
      isSubmitting={false}
    />
  );
};

export default BehandlingPaVent;
