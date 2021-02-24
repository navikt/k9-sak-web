import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import React from 'react';
import UtvidetRettMicrofrontend from './utvidetRettMicrofrontend/UtvidetRettMicrofrontend';

class UtvidetRettMicrofrontendPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMicrofrontend {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.UTVIDET_RETT];

  getData = ({ fagsak, soknad, vilkar }) => ({
    fagsaksType: fagsak.sakstype.kode,
    soknad,
    vilkar,
  });
}
export default UtvidetRettMicrofrontendPanelDef;
