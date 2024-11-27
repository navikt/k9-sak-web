import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { VurderNyoppstartet } from '@k9-sak-web/gui/prosess/vurder-nyoppstartet/VurderNyoppstartet.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class VurderNyoppstartetFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.NYOPPSTARTET;

  getTekstKode = () => 'Nyoppstartet.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_NYOPPSTARTET];

  getEndepunkter = () => [];

  getKomponent = props => <VurderNyoppstartet {...props} />;

  getOverstyrVisningAvKomponent = () => true;
}

export default VurderNyoppstartetFaktaPanelDef;
