import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import InngangsvilkarFortsProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarFortsProsessStegPanelDef';
import MedisinskVilkarProsessStegPanelDef from './prosessStegPaneler/MedisinskVilkarProsessStegPanelDef';
import SaksopplysningerProsessStegPanelDef from './prosessStegPaneler/SaksopplysningerProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import UttakProsessStegPanelDef from './prosessStegPaneler/UttakProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import FortsattMedlemskapProsessStegPanelDef from './prosessStegPaneler/FortsattMedlemskapProsessStegPanelDef';
import OpplaeringProsessStegPanelDef from './prosessStegPaneler/OpplaeringProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
  new SaksopplysningerProsessStegPanelDef(),
  new InngangsvilkarProsessStegPanelDef(),
  new OpplaeringProsessStegPanelDef(),
  new MedisinskVilkarProsessStegPanelDef(),
  new InngangsvilkarFortsProsessStegPanelDef(),
  new FortsattMedlemskapProsessStegPanelDef(),
  new BeregningsgrunnlagProsessStegPanelDef(),
  new UttakProsessStegPanelDef(),
  new TilkjentYtelseProsessStegPanelDef(),
  new SimuleringProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
