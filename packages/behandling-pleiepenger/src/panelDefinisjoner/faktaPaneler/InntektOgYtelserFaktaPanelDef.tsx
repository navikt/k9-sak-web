import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import InntektOgYtelseIndex from '@k9-sak-web/gui/fakta/inntekt-og-ytelse/InntektOgYtelseIndex.js';

import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class InntektOgYtelserFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKT_OG_YTELSER;

  getTekstKode = () => 'InntektOgYtelser.Title';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.INNTEKT_OG_YTELSER];

  getKomponent = props =>
    props.featureToggles?.BRUK_V2_INNTEKT_OG_YTELSE ? (
      <InntektOgYtelseIndex behandlingUuid={props.behandling.uuid} />
    ) : (
      <InntektOgYtelser {...props} />
    );

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

  getData = ({ arbeidsgiverOpplysningerPerId }) => ({
    arbeidsgiverOpplysningerPerId,
  });
}

export default InntektOgYtelserFaktaPanelDef;
