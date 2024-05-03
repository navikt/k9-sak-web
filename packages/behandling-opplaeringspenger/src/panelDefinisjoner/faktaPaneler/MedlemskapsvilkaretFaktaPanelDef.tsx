import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import MedlemskapFaktaIndex from '@k9-sak-web/fakta-medlemskap';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

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

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.MEDLEMSKAP];

  getKomponent = props => <MedlemskapFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger, soknad }) => personopplysninger && soknad;

  getData = ({ fagsakPerson, soknad, personopplysninger }) => ({
    fagsakPerson,
    soknad,
    personopplysninger,
  });
}

export default MedlemskapsvilkaretFaktaPanelDef;
