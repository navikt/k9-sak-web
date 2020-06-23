import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@fpsak-frontend/behandling-felles';

import SokersOpplysningspliktPanelDef from './inngangsvilkarPaneler/SokersOpplysningspliktPanelDef';
import VurderSoknadsfristPanelDef from './inngangsvilkarPaneler/VurderSoknadsfristPanelDef';
import OmsorgenForPanelDef from './inngangsvilkarPaneler/OmsorgenForPanelDef';
import MedlemskapPanelDef from './inngangsvilkarPaneler/MedlemskapPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [
    new SokersOpplysningspliktPanelDef(),
    new VurderSoknadsfristPanelDef(),
    new OmsorgenForPanelDef(),
    new MedlemskapPanelDef(),
  ];
}

export default InngangsvilkarProsessStegPanelDef;
