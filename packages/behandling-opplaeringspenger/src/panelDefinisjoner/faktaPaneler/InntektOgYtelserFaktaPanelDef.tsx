import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import InntektOgYtelser from '@k9-sak-web/fakta-inntekt-og-ytelser';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class InntektOgYtelserFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKT_OG_YTELSER;

  getTekstKode = () => 'InntektOgYtelser.Title';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.INNTEKT_OG_YTELSER];

  getKomponent = props => <InntektOgYtelser {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

  getData = ({ arbeidsgiverOpplysningerPerId }) => ({
    arbeidsgiverOpplysningerPerId,
  });
}

export default InntektOgYtelserFaktaPanelDef;
