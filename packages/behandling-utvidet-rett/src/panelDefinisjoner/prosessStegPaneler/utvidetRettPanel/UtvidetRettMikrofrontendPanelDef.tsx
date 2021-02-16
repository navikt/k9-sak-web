import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import React from 'react';
import UtvidetRettMicrofrontend from '../utvidetRettMicrofrontend/UtvidetRettMicrofrontend';

class UtvidetRettMicrofrontendPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMicrofrontend {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.UTVIDET_RETT];

  getVilkarKoder = () => [vilkarType.UTVIDETRETTVILKARET];

  // getEndepunkter = () => [OmsorgspengerBehandlingApiKeys.TILBAKEKREVINGVALG];
  // getData = data => this.getData(data);

  // TODO-> Förstå överstyring
  getOverstyringspanelDef = () => new ProsessStegOverstyringPanelDef(this, aksjonspunktCodes.UTVIDET_RETT);
}

export default UtvidetRettMicrofrontendPanelDef;
