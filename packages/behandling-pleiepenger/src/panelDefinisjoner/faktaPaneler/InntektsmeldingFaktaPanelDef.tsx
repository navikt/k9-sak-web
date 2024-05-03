import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { Fagsak } from '@k9-sak-web/types';
import Inntektsmelding from '../../components/Inntektsmelding';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

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
    fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
}

export default InntektsmeldingFaktaPanelDef;
