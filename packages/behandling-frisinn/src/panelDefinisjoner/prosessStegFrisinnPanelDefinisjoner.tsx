import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new BeregningsgrunnlagProsessStegPanelDef(),
  new TilkjentYtelseProsessStegPanelDef(),
  new SimuleringProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
