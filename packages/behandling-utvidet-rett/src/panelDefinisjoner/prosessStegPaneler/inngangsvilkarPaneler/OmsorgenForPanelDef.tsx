import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import UtvidetRettMicrofrontend from '../utvidetRettMicrofrontend/UtvidetRettMicrofrontend';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMicrofrontend {...props} />;

  getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  // getVilkarKoder = () => [vilkarType.OMSORGEN_FOR];

  // getEndepunkter = () => [UtvidetRettBehandlingApiKeys.OMSORGEN_FOR];

  // getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  // getData = data => this.overstyringDef.getData(data);
}

export default OmsorgenForPanelDef;
