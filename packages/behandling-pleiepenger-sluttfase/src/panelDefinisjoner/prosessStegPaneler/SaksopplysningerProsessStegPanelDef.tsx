import React from 'react';

import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <CheckPersonStatusIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_PERSONSTATUS];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.MEDLEMSKAP];

  getData = ({ personopplysninger }) => ({
    personopplysninger,
  });
}

class SaksopplysningerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.SAKSOPPLYSNINGER;

  getTekstKode = () => 'Behandlingspunkt.Saksopplysninger';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default SaksopplysningerProsessStegPanelDef;
