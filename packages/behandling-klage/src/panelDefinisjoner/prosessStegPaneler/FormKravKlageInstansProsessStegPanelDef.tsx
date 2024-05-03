import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import FormkravProsessIndex from '@k9-sak-web/prosess-formkrav';
import { Fagsak, FeatureToggles } from '@k9-sak-web/types';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <FormkravProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA];

  getOverstyrVisningAvKomponent = ({ fagsak, featureToggles }: { fagsak: Fagsak; featureToggles: FeatureToggles }) =>
    featureToggles?.KLAGE_KABAL ? fagsak.sakstype.kode === fagsakYtelseType.FRISINN : true;

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

class FormKravKlageInstansProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORMKRAV_KLAGE_NAV_KLAGEINSTANS;

  getTekstKode = () => 'Behandlingspunkt.FormkravKlageKA';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default FormKravKlageInstansProsessStegPanelDef;
