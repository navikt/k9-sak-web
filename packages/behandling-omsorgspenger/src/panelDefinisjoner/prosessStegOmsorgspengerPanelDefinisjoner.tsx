import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import UttakProsessStegPanelDef from './prosessStegPaneler/UttakProsessStegPanelDef';
import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
  new InngangsvilkarProsessStegPanelDef(),
  new UttakProsessStegPanelDef(),
  new BeregningsgrunnlagProsessStegPanelDef(),
  new TilkjentYtelseProsessStegPanelDef(),
  new SimuleringProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
