import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import VergeFaktaPanelDef from './faktaPaneler/VergeFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import UttakFaktaPanelDef from './faktaPaneler/UttakFaktaPanelDef';
import BarnFaktaPanelDef from './faktaPaneler/BarnFaktaPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new ArbeidsforholdFaktaPanelDef(),
  new VergeFaktaPanelDef(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new UttakFaktaPanelDef(),
  new BarnFaktaPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
