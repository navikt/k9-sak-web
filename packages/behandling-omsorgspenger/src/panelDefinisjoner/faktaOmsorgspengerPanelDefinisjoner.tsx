import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import VergeFaktaPanelDef from './faktaPaneler/VergeFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
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
  new BeregningFaktaPanelDef(),
  new NøkkeltallFaktaPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
