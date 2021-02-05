import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import OpptjeningProsessStegPanelDef from './prosessStegPaneler/OpptjeningProsessStegPanelDef';
import MedisinskVilkarProsessStegPanelDef from './prosessStegPaneler/MedisinskVilkarProsessStegPanelDef';
import SaksopplysningerProsessStegPanelDef from './prosessStegPaneler/SaksopplysningerProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import UttakProsessStegPanelDef2 from './prosessStegPaneler/UttakProsessStegPanelDef2';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import FortsattMedlemskapProsessStegPanelDef from './prosessStegPaneler/FortsattMedlemskapProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
  new SaksopplysningerProsessStegPanelDef(),
  new InngangsvilkarProsessStegPanelDef(),
  new MedisinskVilkarProsessStegPanelDef(),
  new OpptjeningProsessStegPanelDef(),
  new BeregningsgrunnlagProsessStegPanelDef(),
  new FortsattMedlemskapProsessStegPanelDef(),
  new UttakProsessStegPanelDef2(),
  new TilkjentYtelseProsessStegPanelDef(),
  new SimuleringProsessStegPanelDef(),
  new VedtakProsessStegPanelDef(),
];

export default prosessStegPanelDefinisjoner;
