import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import OpptjeningProsessStegPanelDef from './prosessStegPaneler/OpptjeningProsessStegPanelDef';
import SaksopplysningerProsessStegPanelDef from './prosessStegPaneler/SaksopplysningerProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import UttakProsessStegPanelDef from './prosessStegPaneler/UttakProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
  new SaksopplysningerProsessStegPanelDef(),
  new InngangsvilkarProsessStegPanelDef(),
  new OpptjeningProsessStegPanelDef(),
  new UttakProsessStegPanelDef(),
  new BeregningsgrunnlagProsessStegPanelDef(),
  new TilkjentYtelseProsessStegPanelDef(),
  new SimuleringProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
