import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef } from '@k9-sak-web/behandling-felles';
import OpptjeningPanelDef from './inngangsvilkarFortsPaneler/OpptjeningPanelDef';
import MedlemskapPanelDef from './inngangsvilkarFortsPaneler/MedlemskapPanelDef';


class InngangsvilkarFortsProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.OPPTJENING;

  getTekstKode = () => 'Behandlingspunkt.InngangsvilkarForts';

  getPanelDefinisjoner = () => [new OpptjeningPanelDef(), new MedlemskapPanelDef()];
}

export default InngangsvilkarFortsProsessStegPanelDef;
