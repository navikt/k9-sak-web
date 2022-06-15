import React from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <FormkravProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({
    alleBehandlinger,
    klageVurdering,
    parterMedKlagerett,
    valgtPartMedKlagerett,
    arbeidsgiverOpplysningerPerId,
    fagsak
  }) => ({
    avsluttedeBehandlinger: alleBehandlinger.filter(b => b.status === behandlingStatus.AVSLUTTET),
    klageVurdering,
    parterMedKlagerett,
    valgtPartMedKlagerett,
    arbeidsgiverOpplysningerPerId,
    fagsak
  });
}

class FormKravFamOgPensjonProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON;

  getTekstKode = () => 'Behandlingspunkt.FormkravKlageNFP';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default FormKravFamOgPensjonProsessStegPanelDef;
