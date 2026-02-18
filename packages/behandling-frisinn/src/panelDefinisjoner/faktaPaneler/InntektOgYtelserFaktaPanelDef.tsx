import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { FrisinnBehandlingApiKeys } from '../../data/frisinnBehandlingApi';

class InntektOgYtelserFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKT_OG_YTELSER;

  getTekstKode = () => 'InntektOgYtelser.Title';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [FrisinnBehandlingApiKeys.INNTEKT_OG_YTELSER];

  getKomponent = props => <InntektOgYtelser {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;
}

export default InntektOgYtelserFaktaPanelDef;
