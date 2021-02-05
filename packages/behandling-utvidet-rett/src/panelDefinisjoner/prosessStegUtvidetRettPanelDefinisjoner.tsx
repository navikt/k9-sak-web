import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import UtvidetRettPanelDef from './prosessStegPaneler/UtvidetRettPanelDef';

const prosessStegPanelDefinisjoner = [
  new InngangsvilkarProsessStegPanelDef(),
  new UtvidetRettPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
