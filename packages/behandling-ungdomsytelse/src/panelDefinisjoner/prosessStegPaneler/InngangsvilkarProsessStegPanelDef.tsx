import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

import AlderPanelDef from './inngangsvilkarPaneler/AlderPanelDef';
import SoknadsfristPanelDef from './inngangsvilkarPaneler/SoknadsfristPanelDef';
import UngdomsprogramPanelDef from './inngangsvilkarPaneler/UngdomsprogramPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [new SoknadsfristPanelDef(), new AlderPanelDef(), new UngdomsprogramPanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
