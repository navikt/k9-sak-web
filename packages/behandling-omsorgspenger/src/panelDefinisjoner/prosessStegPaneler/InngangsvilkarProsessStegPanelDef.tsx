import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import SoknadsfristPanelDef from './inngangsvilkarPaneler/SoknadsfristPanelDef';
import AlderPanelDef from './inngangsvilkarPaneler/AlderPanelDef';
import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';
import OpptjeningPanelDef from './inngangsvilkarPaneler/OpptjeningPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [
    new SoknadsfristPanelDef(),
    new OpptjeningPanelDef(),
    new MedlemskapPanelDef(),
    new AlderPanelDef(),
  ];
}

export default InngangsvilkarProsessStegPanelDef;
