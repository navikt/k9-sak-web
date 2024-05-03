import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import VergeFaktaIndex from '@k9-sak-web/fakta-verge';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';

class VergeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.VERGE;

  getTekstKode = () => 'RegistrereVergeInfoPanel.Info';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_VERGE];

  getEndepunkter = () => [TilbakekrevingBehandlingApiKeys.VERGE];

  getKomponent = props => <VergeFaktaIndex {...props} />;
}

export default VergeFaktaPanelDef;
