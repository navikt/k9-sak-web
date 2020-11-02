import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new ArbeidsforholdFaktaPanelDef(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new FordelBeregningPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
