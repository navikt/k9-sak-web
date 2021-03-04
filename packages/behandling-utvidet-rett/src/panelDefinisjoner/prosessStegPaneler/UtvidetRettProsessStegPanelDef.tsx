import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import UtvidetRettMikrofrontendPanelDef from './utvidetRettPanel/UtvidetRettMikrofrontendPanelDef';

class UtvidetRettProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTVIDET_RETT;

  getTekstKode = () => 'Behandlingspunkt.UtvidetRett';

  getPanelDefinisjoner = () => [new UtvidetRettMikrofrontendPanelDef()];
}

export default UtvidetRettProsessStegPanelDef;
