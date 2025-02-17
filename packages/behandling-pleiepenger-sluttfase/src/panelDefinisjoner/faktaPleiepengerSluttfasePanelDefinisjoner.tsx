import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import InntektsmeldingFaktaPanelDef from './faktaPaneler/InntektsmeldingFaktaPanelDef';
import MedisinskVilkarFaktaPanelDef2 from './faktaPaneler/MedisinskVilkarFaktaPanelDef2';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import NyInntektPanelDef from './faktaPaneler/NyInntektPanelDef';
import OmPleietrengendeFaktaPanelDef from './faktaPaneler/OmPleietrengendeFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import OverstyrBeregningFaktaPanelDef from './faktaPaneler/OverstyrBeregningFaktaPanelDef';
import SoknadsperioderFaktaPanelDef from './faktaPaneler/SoknadsperioderFaktaPanelDef';
import UtenlandsoppholdFaktaPanelDef from './faktaPaneler/UtenlandsoppholdFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new OmPleietrengendeFaktaPanelDef(),
  new ArbeidsforholdFaktaPanelDef(),
  new MedisinskVilkarFaktaPanelDef2(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new InntektsmeldingFaktaPanelDef(),
  new OverstyrBeregningFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
  new NyInntektPanelDef(),
  new FordelBeregningPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
  new UtenlandsoppholdFaktaPanelDef(),
  new SoknadsperioderFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
