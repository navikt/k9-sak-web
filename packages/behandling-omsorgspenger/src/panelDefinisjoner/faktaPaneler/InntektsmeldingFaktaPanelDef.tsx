import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { OmsorgspengerBehandlingApiKeys } from '../../data/omsorgspengerBehandlingApi';

import Inntektsmelding from '../../components/Inntektsmelding';

class InntektsmeldingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKTSMELDING;

  getTekstKode = () => 'InntektsmeldingInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER,
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING,
  ];

  getEndepunkter = () => [OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props => <Inntektsmelding {...props} />;

  getData = ({ arbeidsgiverOpplysningerPerId, dokumenter }) => ({
    arbeidsgiverOpplysningerPerId,
    dokumenter,
  });
}

export default InntektsmeldingFaktaPanelDef;
