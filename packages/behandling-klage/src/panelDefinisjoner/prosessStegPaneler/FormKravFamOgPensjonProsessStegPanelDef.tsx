import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import FormkravProsessIndex from '@k9-sak-web/prosess-formkrav';

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
    fagsak,
  }) => ({
    avsluttedeBehandlinger: alleBehandlinger.filter(b => b.status.kode === behandlingStatus.AVSLUTTET),
    klageVurdering,
    parterMedKlagerett,
    valgtPartMedKlagerett,
    arbeidsgiverOpplysningerPerId,
    fagsak,
  });
}

class FormKravFamOgPensjonProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON;

  getTekstKode = () => 'Behandlingspunkt.FormkravKlageNFP';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default FormKravFamOgPensjonProsessStegPanelDef;
