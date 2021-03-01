import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import React from 'react';
import UtvidetRettMikrofrontend from './utvidetRettMikrofrontend/UtvidetRettMikrofrontend';
import { UtvidetRettBehandlingApiKeys } from '../../../data/utvidetRettBehandlingApi';

class UtvidetRettMikrofrontendPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMikrofrontend {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.UTVIDET_RETT];

  getEndepunkter = () => [UtvidetRettBehandlingApiKeys.VILKAR];

  getData = ({ fagsak, soknad, vilkar }) => ({
    fagsaksType: fagsak.sakstype.kode,
    soknad,
    vilkar,
  });
}
export default UtvidetRettMikrofrontendPanelDef;
