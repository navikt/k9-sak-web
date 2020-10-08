import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import OmsorgenForFaktaPanelDef from './faktaPaneler/OmsorgenForFaktaPanelDef';
import MedisinFaktaPanelDef from './faktaPaneler/MedisinFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import UttakFaktaPanelDef from './faktaPaneler/UttakFaktaPanelDef';
import MedisinskVilkarFaktaPanelDef2 from './faktaPaneler/MedisinskVilkarFaktaPanelDef2';

const faktaPanelDefinisjoner = [
  new ArbeidsforholdFaktaPanelDef(),
  new OmsorgenForFaktaPanelDef(),
  new MedisinFaktaPanelDef(),
  new MedisinskVilkarFaktaPanelDef2(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
  new UttakFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
