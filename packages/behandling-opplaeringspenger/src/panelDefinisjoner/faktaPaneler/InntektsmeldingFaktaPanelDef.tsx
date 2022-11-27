import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { Fagsak } from '@k9-sak-web/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';
import Inntektsmelding from '../../components/Inntektsmelding';

class InntektsmeldingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKTSMELDING;

  getTekstKode = () => 'InntektsmeldingInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER,
    aksjonspunktCodes.INNTEKTSMELDING_MANGLER_ENDELIG_AVKLARING,
  ];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.ARBEIDSFORHOLD];

  getKomponent = props => <Inntektsmelding {...props} />;

  getData = ({ arbeidsgiverOpplysningerPerId, dokumenter, hentSaksbehandlere }) => ({
    arbeidsgiverOpplysningerPerId,
    dokumenter,
    saksbehandlere: hentSaksbehandlere?.saksbehandlere,
  });

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
}

export default InntektsmeldingFaktaPanelDef;
