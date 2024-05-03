import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
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
