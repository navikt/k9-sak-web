import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';
import Inntektsmelding from '../../components/Inntektsmelding';
import InntektsmeldingV2 from '@k9-sak-web/gui/fakta/inntektsmelding/src/ui/InntektsmeldingContainer.js';

class InntektsmeldingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKTSMELDING;

  getTekstKode = () => 'InntektsmeldingInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER,
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING,
  ];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_INNTEKTSMELDING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return <InntektsmeldingV2 {...props} {...deepCopyProps} />;
    }
    return <Inntektsmelding {...props} />;
  };

  getData = ({ arbeidsgiverOpplysningerPerId, dokumenter }) => ({
    arbeidsgiverOpplysningerPerId,
    dokumenter,
  });

  getOverstyrVisningAvKomponent = () => true;
}

export default InntektsmeldingFaktaPanelDef;
