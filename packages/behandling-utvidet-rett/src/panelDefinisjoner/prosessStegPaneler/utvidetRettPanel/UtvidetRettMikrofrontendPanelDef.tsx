import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import React from 'react';
import { UtvidetRettBehandlingApiKeys } from '../../../data/utvidetRettBehandlingApi';
import UtvidetRettMikrofrontend from './utvidetRettMikrofrontend/UtvidetRettMikrofrontend';

class UtvidetRettMikrofrontendPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMikrofrontend {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.UTVIDET_RETT];

  getVilkarKoder = () => [vilkarType.UTVIDETRETTVILKARET];

  getEndepunkter = () => [UtvidetRettBehandlingApiKeys.VILKAR];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ fagsak, soknad }) => ({
    saksInformasjon: {
      fagsaksType: fagsak.sakstype.kode,
      soknad,
    },
  });
}

export default UtvidetRettMikrofrontendPanelDef;
