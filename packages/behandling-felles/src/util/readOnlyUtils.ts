import KlageVurdering from "@fpsak-frontend/behandling-klage/src/types/klageVurderingTsType";
import { allAccessRights } from '@fpsak-frontend/fp-felles';
import { Behandling, NavAnsatt, Aksjonspunkt, Vilkar } from '@k9-sak-web/types';

import FagsakInfo from '../types/fagsakInfoTsType';

const getRettigheter = (navAnsatt: NavAnsatt, fagsak: FagsakInfo, behandling: Behandling) =>
  allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);

const harBehandlingReadOnlyStatus = (behandling: Behandling) =>
  behandling.taskStatus && behandling.taskStatus.readOnly ? behandling.taskStatus.readOnly : false;

const erReadOnly = (
  behandling: Behandling,
  aksjonspunkterForPunkt: Aksjonspunkt[],
  vilkarlisteForPunkt: Vilkar[],
  navAnsatt: NavAnsatt,
  fagsak: FagsakInfo,
  hasFetchError: boolean,
  stegkode?: string,
  klagevurdering?: KlageVurdering
) => {
  const { behandlingPaaVent } = behandling;
  const rettigheter = getRettigheter(navAnsatt, fagsak, behandling);
  const isBehandlingReadOnly = hasFetchError || harBehandlingReadOnlyStatus(behandling);
  const hasInactiveAksjonspunkter = aksjonspunkterForPunkt.some(ap => !ap.erAktivt);
  const erVedtaksinstansstegForKlageSomHarKommetTilKlageinstans =
    (stegkode === 'formkrav_klage_nav_familie_og_pensjon' || stegkode === 'klage_nav_familie_og_pensjon')
    && !!klagevurdering?.klageFormkravResultatKA;

  return !rettigheter.writeAccess.isEnabled
         || behandlingPaaVent
         || isBehandlingReadOnly
         || hasInactiveAksjonspunkter
         || erVedtaksinstansstegForKlageSomHarKommetTilKlageinstans;
};

const readOnlyUtils = {
  erReadOnly,
  harBehandlingReadOnlyStatus,
};

export default readOnlyUtils;
