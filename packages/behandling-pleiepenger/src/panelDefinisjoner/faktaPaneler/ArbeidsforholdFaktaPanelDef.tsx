import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import ArbeidsforholdFaktaIndex from '@k9-sak-web/fakta-arbeidsforhold';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class ArbeidsforholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ARBEIDSFORHOLD;

  getTekstKode = () => 'ArbeidsforholdInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props => <ArbeidsforholdFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

  getData = ({ personopplysninger, arbeidsgiverOpplysningerPerId }) => ({
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
  });
}

export default ArbeidsforholdFaktaPanelDef;
