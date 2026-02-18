import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class InntektOgYtelserFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKT_OG_YTELSER;

  getTekstKode = () => 'InntektOgYtelser.Title';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.INNTEKT_OG_YTELSER];

  getKomponent = props => <InntektOgYtelser {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

  getData = ({ arbeidsgiverOpplysningerPerId }) => ({
    arbeidsgiverOpplysningerPerId,
  });
}

export default InntektOgYtelserFaktaPanelDef;
