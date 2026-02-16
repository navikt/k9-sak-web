import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import AlderPanelDef from './inngangsvilkarPaneler/AlderPanelDef';
import SoknadsfristPanelDef from './inngangsvilkarPaneler/SoknadsfristPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [new SoknadsfristPanelDef(), new AlderPanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
