import InngangsvilkarFortsProsessStegPanelDef from '@k9-sak-web/behandling-pleiepenger/src/panelDefinisjoner/prosessStegPaneler/InngangsvilkarFortsProsessStegPanelDef';
import BeregningsgrunnlagProsessStegPanelDef from './prosessStegPaneler/BeregningsgrunnlagProsessStegPanelDef';
import FortsattMedlemskapProsessStegPanelDef from './prosessStegPaneler/FortsattMedlemskapProsessStegPanelDef';
import InngangsvilkarProsessStegPanelDef from './prosessStegPaneler/InngangsvilkarProsessStegPanelDef';
import MedisinskVilkarProsessStegPanelDef from './prosessStegPaneler/MedisinskVilkarProsessStegPanelDef';
import SimuleringProsessStegPanelDef from './prosessStegPaneler/SimuleringProsessStegPanelDef';
import TilkjentYtelseProsessStegPanelDef from './prosessStegPaneler/TilkjentYtelseProsessStegPanelDef';
import UttakProsessStegPanelDef from './prosessStegPaneler/UttakProsessStegPanelDef';
import VarselProsessStegPanelDef from './prosessStegPaneler/VarselProsessStegPanelDef';
import VedtakProsessStegPanelDef from './prosessStegPaneler/VedtakProsessStegPanelDef';

const prosessStegPanelDefinisjoner = [
  new VarselProsessStegPanelDef(),
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
