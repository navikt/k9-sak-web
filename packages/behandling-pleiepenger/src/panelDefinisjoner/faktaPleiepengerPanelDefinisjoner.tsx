import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import MedisinskVilkarFaktaPanelDef2 from './faktaPaneler/MedisinskVilkarFaktaPanelDef2';

const faktaPanelDefinisjoner = [
  new ArbeidsforholdFaktaPanelDef(),
  new MedisinskVilkarFaktaPanelDef2(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
