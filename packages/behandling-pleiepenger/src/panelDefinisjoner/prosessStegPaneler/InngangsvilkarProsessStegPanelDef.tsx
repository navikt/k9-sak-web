import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import SoknadsfristPanelDef from './inngangsvilkarPaneler/SoknadsfristPanelDef';
import AlderPanelDef from './inngangsvilkarPaneler/AlderPanelDef';
import OmsorgenForPanelDef from './inngangsvilkarPaneler/OmsorgenForPanelDef';
import SokersOpplysningspliktPanelDef from './inngangsvilkarPaneler/SokersOpplysningspliktPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [
    new SoknadsfristPanelDef(),
    new AlderPanelDef(),
    new OmsorgenForPanelDef(),
    new SokersOpplysningspliktPanelDef(),
  ];
}

export default InngangsvilkarProsessStegPanelDef;
