import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import SokersOpplysningspliktPanelDef from './inngangsvilkarPaneler/SokersOpplysningspliktPanelDef';
import OmsorgenForPanelDef from './inngangsvilkarPaneler/OmsorgenForPanelDef';
import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [
    new SokersOpplysningspliktPanelDef(),
    new OmsorgenForPanelDef(),
    new MedlemskapPanelDef(),
  ];
}

export default InngangsvilkarProsessStegPanelDef;
