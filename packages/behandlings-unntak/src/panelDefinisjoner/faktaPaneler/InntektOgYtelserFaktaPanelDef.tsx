import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import unntakBehandlingApi from '../../data/unntakBehandlingApi';

class InntektOgYtelserFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.INNTEKT_OG_YTELSER;

  getTekstKode = () => 'InntektOgYtelser.Title';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [unntakBehandlingApi.INNTEKT_OG_YTELSER];

  getKomponent = props => <InntektOgYtelser {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;
}

export default InntektOgYtelserFaktaPanelDef;
