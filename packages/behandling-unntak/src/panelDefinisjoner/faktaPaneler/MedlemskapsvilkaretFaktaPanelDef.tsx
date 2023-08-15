import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { UnntakBehandlingApiKeys } from '../../data/unntakBehandlingApi';

class MedlemskapsvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDLEMSKAPSVILKARET;

  getTekstKode = () => 'MedlemskapInfoPanel.Medlemskap';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
    aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
    aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
  ];

  getEndepunkter = () => [UnntakBehandlingApiKeys.MEDLEMSKAP, UnntakBehandlingApiKeys.HENT_SAKSBEHANDLERE];

  getKomponent = props => <MedlemskapFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger, soknad }) => personopplysninger && soknad;

  getData = ({ fagsakPerson, soknad, personopplysninger, hentSaksbehandlere }) => ({
    fagsakPerson,
    soknad,
    personopplysninger,
    saksbehandlere: hentSaksbehandlere?.saksbehandlere || {},
  });
}

export default MedlemskapsvilkaretFaktaPanelDef;
