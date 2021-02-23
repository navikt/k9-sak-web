import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import UtvidetRettMicrofrontend from '../utvidetRettMicrofrontend/UtvidetRettMicrofrontend';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMicrofrontend {...props} />;

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getVilkarKoder = () => [vilkarType.OMP_OMSORGENFORVILKARET];
}

export default OmsorgenForPanelDef;
