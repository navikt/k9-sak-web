import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { Fagsak } from '@k9-sak-web/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

import Inntektsmelding from '../../components/Inntektsmelding';

class InntektsmeldingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKTSMELDING;

  getTekstKode = () => 'InntektsmeldingInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER,
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING,
  ];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props => <Inntektsmelding {...props} />;

  getData = ({ arbeidsgiverOpplysningerPerId, dokumenter }) => ({
    arbeidsgiverOpplysningerPerId,
    dokumenter,
  });

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype === fagsakYtelseType.PLEIEPENGER_SLUTTFASE;
}

export default InntektsmeldingFaktaPanelDef;
