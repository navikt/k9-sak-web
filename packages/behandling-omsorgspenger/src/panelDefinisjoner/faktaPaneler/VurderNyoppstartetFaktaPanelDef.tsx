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

  getOverstyrVisningAvKomponent = (props, featureToggles, apCodes) =>
    !!featureToggles['OMS_NYOPPSTARTET'] && this.getAksjonspunktKoder().some(a => apCodes.includes(a)); // TODO: Dette kan fjernes når featureToggle fjernes. Sjekk på aksjonspunkt skjer i skalVisePanel
}

export default VurderNyoppstartetFaktaPanelDef;
