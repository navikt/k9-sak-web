import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import UtvidetRettProsessStegPanelDef from './prosessStegPaneler/UtvidetRettProsessStegPanelDef';


const prosessStegUtvidetRettPanelDefinisjoner = (erFagytelseTypeAleneOmOmsorgen: boolean) => [
    new InngangsvilkarProsessStegPanelDef(),
    new UtvidetRettProsessStegPanelDef(erFagytelseTypeAleneOmOmsorgen),
    new VedtakProsessStegPanelDef(),
  ];


export default prosessStegUtvidetRettPanelDefinisjoner;
