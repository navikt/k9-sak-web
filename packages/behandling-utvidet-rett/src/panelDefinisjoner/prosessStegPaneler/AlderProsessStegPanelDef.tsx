import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import AlderPanelDef from './alderPaneler/AlderPaneDef';

class AlderProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.ALDER;

  getTekstKode = () => 'Behandlingspunkt.Alder';

  getPanelDefinisjoner = () => [new AlderPanelDef()];
}

export default AlderProsessStegPanelDef;
