import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import DirekteOvergangFaktaPanelDef from './faktaPaneler/DirekteOvergangFaktaPanelDef';
import EtablertTilsynFaktaPanelDef from './faktaPaneler/EtablertTilsynFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import InntektsmeldingFaktaPanelDef from './faktaPaneler/InntektsmeldingFaktaPanelDef';
import InstitusjonFaktaPanelDef from './faktaPaneler/InstitusjonFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import NyInntektPanelDef from './faktaPaneler/NyInntektPanelDef';
import OmBarnetFaktaPanelDef from './faktaPaneler/OmBarnetFaktaPanelDef';
import OmsorgenForFaktaPanelDef from './faktaPaneler/OmsorgenForFaktaPanelDef';
import OpplaeringFaktaPanelDef from './faktaPaneler/OpplaeringFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import OverstyrBeregningFaktaPanelDef from './faktaPaneler/OverstyrBeregningFaktaPanelDef';
import SoknadsperioderFaktaPanelDef from './faktaPaneler/SoknadsperioderFaktaPanelDef';
import LangvarigSykFaktaPanelDef from "./faktaPaneler/LangvarigSykFaktaPanelDef";

const faktaPanelDefinisjoner = [
  new OmBarnetFaktaPanelDef(),
  new ArbeidsforholdFaktaPanelDef(),
  new InstitusjonFaktaPanelDef(),
  new DirekteOvergangFaktaPanelDef(),
  new OmsorgenForFaktaPanelDef(),
  new LangvarigSykFaktaPanelDef(),
  new OpplaeringFaktaPanelDef(),
  new EtablertTilsynFaktaPanelDef(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new InntektsmeldingFaktaPanelDef(),
  new OverstyrBeregningFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
  new NyInntektPanelDef(),
  new FordelBeregningPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
  new SoknadsperioderFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
