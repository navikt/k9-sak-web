import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import VergeFaktaPanelDef from './faktaPaneler/VergeFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import UttakFaktaPanelDef from './faktaPaneler/UttakFaktaPanelDef';
import BarnFaktaPanelDef from './faktaPaneler/BarnFaktaPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import InntektsmeldingFaktaPanelDef from './faktaPaneler/InntektsmeldingFaktaPanelDef';
import OmsorgenForFaktaPanelDef from './faktaPaneler/OmsorgenForFaktaPanelDef';

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
];

const faktaPanelDefinisjoner = [
  ...faktaPanelDefinisjonerUtenOmsorgenFor,
  new OmsorgenForFaktaPanelDef(),
];


export default faktaPanelDefinisjoner;
