import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import InntektsmeldingFaktaPanelDef from './faktaPaneler/InntektsmeldingFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import OverstyrBeregningFaktaPanelDef from './faktaPaneler/OverstyrBeregningFaktaPanelDef';
import OmPleietrengendeFaktaPanelDef from "./faktaPaneler/OmPleietrengendeFaktaPanelDef";
import MedisinskVilkarFaktaPanelDef from './faktaPaneler/MedisinskVilkarFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new OmPleietrengendeFaktaPanelDef(),
  new ArbeidsforholdFaktaPanelDef(),
  new MedisinskVilkarFaktaPanelDef(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new InntektsmeldingFaktaPanelDef(),
  new OverstyrBeregningFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
  new FordelBeregningPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
