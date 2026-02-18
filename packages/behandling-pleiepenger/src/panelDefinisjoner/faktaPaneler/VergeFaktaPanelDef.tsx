import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class VergeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.VERGE;

  getTekstKode = () => 'RegistrereVergeInfoPanel.Info';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_VERGE];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.VERGE];

  getKomponent = props => <VergeFaktaIndex {...props} />;
}

export default VergeFaktaPanelDef;
