import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import FortsattMedlemskapProsessStegPanelDef from './prosessStegPaneler/FortsattMedlemskapProsessStegPanelDef';
import InngangsvilkarFortsProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarFortsProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import MedisinskVilkarProsessStegPanelDef from './prosessStegPaneler/MedisinskVilkarProsessStegPanelDef';
import OpplaeringProsessStegPanelDef from './prosessStegPaneler/OpplaeringProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import UttakProsessStegPanelDef from './prosessStegPaneler/UttakProsessStegPanelDef';
import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
  new InngangsvilkarProsessStegPanelDef(),
  new MedisinskVilkarProsessStegPanelDef(),
  new OpplaeringProsessStegPanelDef(),
  new InngangsvilkarFortsProsessStegPanelDef(),
  new FortsattMedlemskapProsessStegPanelDef(),
  new BeregningsgrunnlagProsessStegPanelDef(),
  new UttakProsessStegPanelDef(),
  new TilkjentYtelseProsessStegPanelDef(),
  new SimuleringProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
