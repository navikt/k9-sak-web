import InngangsvilkarFortsProsessStegPanelDef
  from '@k9-sak-web/behandling-pleiepenger/src/panelDefinisjoner/prosessStegPaneler/InngangsvilkarFortsProsessStegPanelDef';
import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import MedisinskVilkarProsessStegPanelDef from './prosessStegPaneler/MedisinskVilkarProsessStegPanelDef';
import SaksopplysningerProsessStegPanelDef from './prosessStegPaneler/SaksopplysningerProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import UttakProsessStegPanelDef from './prosessStegPaneler/UttakProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';
import FortsattMedlemskapProsessStegPanelDef from './prosessStegPaneler/FortsattMedlemskapProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
  new SaksopplysningerProsessStegPanelDef(),
  new InngangsvilkarProsessStegPanelDef(),
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
