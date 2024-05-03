import React from 'react';

import ArbeidsforholdFaktaIndex from '@k9-sak-web/fakta-arbeidsforhold';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { OmsorgspengerBehandlingApiKeys } from '../../data/omsorgspengerBehandlingApi';

class ArbeidsforholdFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ARBEIDSFORHOLD;

  getTekstKode = () => 'ArbeidsforholdInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

  getEndepunkter = () => [OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props => <ArbeidsforholdFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

  getData = ({ personopplysninger, arbeidsgiverOpplysningerPerId }) => ({
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
  });
}

export default ArbeidsforholdFaktaPanelDef;
