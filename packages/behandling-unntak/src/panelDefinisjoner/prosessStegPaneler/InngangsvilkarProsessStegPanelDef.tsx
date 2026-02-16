import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [new MedlemskapPanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
