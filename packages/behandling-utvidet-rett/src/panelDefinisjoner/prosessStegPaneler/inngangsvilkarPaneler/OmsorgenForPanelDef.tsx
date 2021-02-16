import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import React from 'react';
import { UtvidetRettBehandlingApiKeys } from '../../../data/utvidetRettBehandlingApi';
import UtvidetRettMicrofrontend from '../utvidetRettMicrofrontend/UtvidetRettMicrofrontend';

class OmsorgenForPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMicrofrontend {...props} />;

  // getTekstKode = () => 'Inngangsvilkar.OmsorgenFor';

  getTekstKode = () => 'Inngangsvilkar.Medlemskapsvilkaret';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR];

  // getVilkarKoder = () => [vilkarType.OMSORGENFORVILKARET];
  getVilkarKoder = () => [vilkarType.MEDLEMSKAPSVILKARET];

  getEndepunkter = () => [UtvidetRettBehandlingApiKeys.MEDLEMSKAP];

  // getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  // getData = data => this.overstyringDef.getData(data);
}

export default OmsorgenForPanelDef;
