import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { VurderNyoppstartet } from '@k9-sak-web/gui/fakta/vurder-nyoppstartet/VurderNyoppstartet.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class VurderNyoppstartetFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.NYOPPSTARTET;

  getTekstKode = () => 'Nyoppstartet.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_NYOPPSTARTET];

  getEndepunkter = () => [];

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <VurderNyoppstartet {...props} {...deepCopyProps} />;
  };

  getOverstyrVisningAvKomponent = (_, featureToggles) => !!featureToggles['OMS_NYOPPSTARTET'];
}

export default VurderNyoppstartetFaktaPanelDef;
