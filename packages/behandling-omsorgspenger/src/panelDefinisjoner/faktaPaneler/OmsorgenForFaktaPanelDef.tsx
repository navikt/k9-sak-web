import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import OmsorgenFor from '../../components/OmsorgenFor';

class OmsorgenForFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OMSORGEN_FOR;

  getTekstKode = () => 'OmsorgenForInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_OMSORGEN_FOR];

  getEndepunkter = () => [];

  getKomponent = props => <OmsorgenFor {...props} />;

  getOverstyrVisningAvKomponent = () => true;
}

export default OmsorgenForFaktaPanelDef;
