import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

import AlderPanelDef from './inngangsvilkarPaneler/AlderPanelDef';
import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';
import OmsorgenForPanelDef from './inngangsvilkarPaneler/OmsorgenForPanelDef';
import OpptjeningPanelDef from './inngangsvilkarPaneler/OpptjeningPanelDef';
import SoknadsfristPanelDef from './inngangsvilkarPaneler/SoknadsfristPanelDef';
import TiDagerProsessStegPanelDef from './TiDagerProsessStegPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [
    new SoknadsfristPanelDef(),
    new TiDagerProsessStegPanelDef(),
    new OmsorgenForPanelDef(),
    new OpptjeningPanelDef(),
    new MedlemskapPanelDef(),
    new AlderPanelDef(),
  ];
}

export default InngangsvilkarProsessStegPanelDef;
