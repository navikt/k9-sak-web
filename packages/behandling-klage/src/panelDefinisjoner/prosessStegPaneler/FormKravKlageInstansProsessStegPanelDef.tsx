import React from 'react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak } from '@k9-sak-web/types';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <FormkravProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA];

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) => fagsak.sakstype.kode === fagsakYtelseType.FRISINN;

  getData = ({
    alleBehandlinger,
    klageVurdering,
    parterMedKlagerett,
    valgtPartMedKlagerett,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
  }) => ({
    avsluttedeBehandlinger: alleBehandlinger.filter(b => b.status.kode === behandlingStatus.AVSLUTTET),
    klageVurdering,
    parterMedKlagerett,
    valgtPartMedKlagerett,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
  });
}

class FormKravKlageInstansProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORMKRAV_KLAGE_NAV_KLAGEINSTANS;

  getTekstKode = () => 'Behandlingspunkt.FormkravKlageKA';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default FormKravKlageInstansProsessStegPanelDef;
