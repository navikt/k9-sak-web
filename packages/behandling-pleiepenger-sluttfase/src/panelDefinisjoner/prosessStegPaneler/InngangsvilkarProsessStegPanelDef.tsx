import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';

import OpptjeningPanelDef from "@k9-sak-web/behandling-omsorgspenger/src/panelDefinisjoner/prosessStegPaneler/inngangsvilkarPaneler/OpptjeningPanelDef";
import MedlemskapPanelDef from "@k9-sak-web/behandling-omsorgspenger/src/panelDefinisjoner/prosessStegPaneler/inngangsvilkarPaneler/MedlemskapPanelDef";
import SoknadsfristPanelDef from './inngangsvilkarPaneler/SoknadsfristPanelDef';
import AlderPanelDef from './inngangsvilkarPaneler/AlderPanelDef';

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';

  getPanelDefinisjoner = () => [
    new SoknadsfristPanelDef(),
    new AlderPanelDef(),
    new OpptjeningPanelDef(),
    new MedlemskapPanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
