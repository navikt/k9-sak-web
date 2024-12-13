import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import OpptjeningProsessStegPanelDef from './prosessStegPaneler/OpptjeningProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import UnntakProsessStegPanelDef from './prosessStegPaneler/UnntakProsessStegPanelDef';
import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
  new InngangsvilkarProsessStegPanelDef(),
  new OpptjeningProsessStegPanelDef(),
  new UnntakProsessStegPanelDef(),
  new TilkjentYtelseProsessStegPanelDef(),
  new SimuleringProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
