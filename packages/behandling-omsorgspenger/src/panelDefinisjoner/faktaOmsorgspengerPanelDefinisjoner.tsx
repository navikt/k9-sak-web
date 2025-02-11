import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import BarnFaktaPanelDef from './faktaPaneler/BarnFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import InntektsmeldingFaktaPanelDef from './faktaPaneler/InntektsmeldingFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OmsorgenForFaktaPanelDef from './faktaPaneler/OmsorgenForFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import UttakFaktaPanelDef from './faktaPaneler/UttakFaktaPanelDef';
import VergeFaktaPanelDef from './faktaPaneler/VergeFaktaPanelDef';
import VurderNyoppstartetFaktaPanelDef from './faktaPaneler/VurderNyoppstartetFaktaPanelDef';

export const faktaPanelDefinisjonerUtenOmsorgenFor = [
  new ArbeidsforholdFaktaPanelDef(),
  new VergeFaktaPanelDef(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new InntektsmeldingFaktaPanelDef(),
  new UttakFaktaPanelDef(),
  new BarnFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
  new FordelBeregningPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
  new VurderNyoppstartetFaktaPanelDef(),
];

const faktaPanelDefinisjoner = [...faktaPanelDefinisjonerUtenOmsorgenFor, new OmsorgenForFaktaPanelDef()];

export default faktaPanelDefinisjoner;
