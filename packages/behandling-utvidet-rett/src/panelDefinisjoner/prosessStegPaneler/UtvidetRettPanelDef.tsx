import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import UtvidetRettMicrofrontendPanelDef from './utvidetRettPanel/UtvidetRettMikrofrontendPanelDef';

class UtvidetRettProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTVIDET_RETT;

  getTekstKode = () => 'Behandlingspunkt.UtvidetRett';

  getPanelDefinisjoner = () => [new UtvidetRettMicrofrontendPanelDef()];
}

export default UtvidetRettProsessStegPanelDef;
