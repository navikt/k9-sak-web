import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import UtvidetRettMikrofrontendPanelDef from './utvidetRettPanel/UtvidetRettMikrofrontendPanelDef';

class UtvidetRettProsessStegPanelDef extends ProsessStegDef {
  erFagytelseTypeAleneOmOmsorgen: boolean;

  constructor(erFagytelseTypeAleneOmOmsorgen) {
    super();
    this.erFagytelseTypeAleneOmOmsorgen = erFagytelseTypeAleneOmOmsorgen;
  }

  getUrlKode = () => prosessStegCodes.UTVIDET_RETT;

  getTekstKode = () =>
    this.erFagytelseTypeAleneOmOmsorgen ? 'Behandlingspunkt.AleneOmOmsorgen' : 'Behandlingspunkt.UtvidetRett';

  getPanelDefinisjoner = () => [new UtvidetRettMikrofrontendPanelDef()];
}

export default UtvidetRettProsessStegPanelDef;
