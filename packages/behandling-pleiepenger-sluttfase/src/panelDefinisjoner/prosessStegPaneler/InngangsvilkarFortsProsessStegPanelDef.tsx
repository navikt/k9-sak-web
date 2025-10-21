import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import MedlemskapPanelDef from './inngangsvilkarFortsPaneler/MedlemskapPanelDef.js';
import OpptjeningPanelDef from './inngangsvilkarFortsPaneler/OpptjeningPanelDef.js';

class InngangsvilkarFortsProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPTJENING;

  getTekstKode = () => 'Behandlingspunkt.InngangsvilkarForts';

  getPanelDefinisjoner = () => [new OpptjeningPanelDef(), new MedlemskapPanelDef()];
}

export default InngangsvilkarFortsProsessStegPanelDef;
