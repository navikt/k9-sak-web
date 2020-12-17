import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import VergeFaktaPanelDef from './faktaPaneler/VergeFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import UttakFaktaPanelDef from './faktaPaneler/UttakFaktaPanelDef';
import BarnFaktaPanelDef from './faktaPaneler/BarnFaktaPanelDef';
import NøkkeltallFaktaPanelDef from './faktaPaneler/NøkkeltallFaktaPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new ArbeidsforholdFaktaPanelDef(),
  new VergeFaktaPanelDef(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new UttakFaktaPanelDef(),
  new BarnFaktaPanelDef(),
  new FordelBeregningPanelDef(),
  new NøkkeltallFaktaPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
