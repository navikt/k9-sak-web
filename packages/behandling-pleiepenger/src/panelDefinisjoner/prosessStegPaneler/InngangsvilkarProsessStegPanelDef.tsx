import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import SoknadsfristPanelDef from './inngangsvilkarPaneler/SoknadsfristPanelDef';
import AlderPanelDef from './inngangsvilkarPaneler/AlderPanelDef';
import OmsorgenForPanelDef from './inngangsvilkarPaneler/OmsorgenForPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [new SoknadsfristPanelDef(), new AlderPanelDef(), new OmsorgenForPanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
