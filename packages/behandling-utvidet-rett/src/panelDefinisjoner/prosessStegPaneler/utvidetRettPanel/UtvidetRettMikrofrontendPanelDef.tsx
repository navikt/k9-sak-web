import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Personopplysninger, Soknad } from '@k9-sak-web/types';
import { UtvidetRettBehandlingApiKeys } from '../../../data/utvidetRettBehandlingApi';
import { UtvidetRettMikrofrontend } from './utvidetRettMikrofrontend/UtvidetRettMikrofrontend';

class UtvidetRettMikrofrontendPanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UtvidetRettMikrofrontend {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.UTVIDET_RETT];

  getVilkarKoder = () => [vilkarType.UTVIDETRETTVILKARET];

  getEndepunkter = () => [UtvidetRettBehandlingApiKeys.VILKAR];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({
    fagsak,
    soknad,
    personopplysninger,
  }: {
    fagsak: Fagsak;
    soknad: Soknad;
    personopplysninger: Personopplysninger;
  }) => ({
    saksInformasjon: {
      fagsaksType: fagsak.sakstype,
      soknad,
      personopplysninger,
    },
  });
}

export default UtvidetRettMikrofrontendPanelDef;
