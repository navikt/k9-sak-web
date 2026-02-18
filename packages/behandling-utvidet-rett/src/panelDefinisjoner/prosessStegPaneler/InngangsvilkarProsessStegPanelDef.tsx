import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import OmsorgenForPanelDef from './inngangsvilkarPaneler/OmsorgenForPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.OmsorgenFor';

  getPanelDefinisjoner = () => [new OmsorgenForPanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
