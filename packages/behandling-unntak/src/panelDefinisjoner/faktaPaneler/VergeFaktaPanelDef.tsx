import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import VergeFaktaIndex from '@k9-sak-web/fakta-verge';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { UnntakBehandlingApiKeys } from '../../data/unntakBehandlingApi';

class VergeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.VERGE;

  getTekstKode = () => 'RegistrereVergeInfoPanel.Info';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_VERGE];

  getEndepunkter = () => [UnntakBehandlingApiKeys.VERGE];

  getKomponent = props => <VergeFaktaIndex {...props} />;
}

export default VergeFaktaPanelDef;
