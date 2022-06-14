import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import React from 'react';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import UtvidetRettMikrofrontend from './utvidetRettMikrofrontend/UtvidetRettMikrofrontend';
import { UtvidetRettBehandlingApiKeys } from '../../../data/utvidetRettBehandlingApi';

class UtvidetRettMikrofrontendPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMikrofrontend {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.UTVIDET_RETT];

  getVilkarKoder = () => [vilkarType.UTVIDETRETTVILKARET];

  getEndepunkter = () => [UtvidetRettBehandlingApiKeys.VILKAR];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, soknad }) => ({
    saksInformasjon: {
      fagsaksType: fagsak.sakstype,
      soknad,
    },
  });
}

export default UtvidetRettMikrofrontendPanelDef;
