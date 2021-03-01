import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import UtvidetRettProsessStegPanelDef from './prosessStegPaneler/UtvidetRettProsessStegPanelDef';

const prosessStegUtvidetRettPanelDefinisjoner = [
  new InngangsvilkarProsessStegPanelDef(),
  new UtvidetRettProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegUtvidetRettPanelDefinisjoner;
