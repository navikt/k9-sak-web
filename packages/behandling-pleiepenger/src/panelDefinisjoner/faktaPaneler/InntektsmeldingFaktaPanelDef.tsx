import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { Fagsak } from '@k9-sak-web/types';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';
import Inntektsmelding from '../../components/Inntektsmelding';

class InntektsmeldingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKTSMELDING;

  getTekstKode = () => 'InntektsmeldingInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER,
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING,
  ];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props => <Inntektsmelding {...props} />;

  getData = ({ arbeidsgiverOpplysningerPerId, dokumenter }) => ({
    arbeidsgiverOpplysningerPerId,
    dokumenter,
  });

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
}

export default InntektsmeldingFaktaPanelDef;
