import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { Fagsak } from '@k9-sak-web/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';
import Inntektsmelding from '../../components/Inntektsmelding';
import InntektsmeldingGammelFlyt from '../../components/InntektsmeldingGammelFlyt';

class InntektsmeldingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKTSMELDING;

  getTekstKode = () => 'InntektsmeldingInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER,
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING,
  ];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props =>
    props?.featureToggles?.INNTEKTSMELDING_NY_FLYT ? (
      <Inntektsmelding {...props} />
    ) : (
      <InntektsmeldingGammelFlyt {...props} />
    );

  getData = ({ arbeidsgiverOpplysningerPerId, dokumenter, hentSaksbehandlere }) => ({
    arbeidsgiverOpplysningerPerId,
    dokumenter,
    saksbehandlere: hentSaksbehandlere?.saksbehandlere,
  });

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
}

export default InntektsmeldingFaktaPanelDef;
