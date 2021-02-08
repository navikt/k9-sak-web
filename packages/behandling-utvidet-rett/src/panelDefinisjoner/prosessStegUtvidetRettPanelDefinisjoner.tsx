import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import UtvidetRettProsessStegPanelDef from './prosessStegPaneler/UtvidetRettPanelDef';

const prosessStegPanelDefinisjoner = [
  new InngangsvilkarProsessStegPanelDef(),
  new UtvidetRettProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
