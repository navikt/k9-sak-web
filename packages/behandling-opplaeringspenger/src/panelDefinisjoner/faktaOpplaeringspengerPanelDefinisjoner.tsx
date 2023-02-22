import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import MedisinskVilkarFaktaPanelDef2 from './faktaPaneler/MedisinskVilkarFaktaPanelDef2';
import OmsorgenForFaktaPanelDef from './faktaPaneler/OmsorgenForFaktaPanelDef';
import InntektsmeldingFaktaPanelDef from './faktaPaneler/InntektsmeldingFaktaPanelDef';
import EtablertTilsynFaktaPanelDef from './faktaPaneler/EtablertTilsynFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import OmBarnetFaktaPanelDef from './faktaPaneler/OmBarnetFaktaPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import OverstyrBeregningFaktaPanelDef from './faktaPaneler/OverstyrBeregningFaktaPanelDef';
import DirekteOvergangFaktaPanelDef from './faktaPaneler/DirekteOvergangFaktaPanelDef';
import UtenlandsoppholdFaktaPanelDef from './faktaPaneler/UtenlandsoppholdFaktaPanelDef';
import SoknadsperioderFaktaPanelDef from './faktaPaneler/SoknadsperioderFaktaPanelDef';
import InstitusjonFaktaPanelDef from './faktaPaneler/InstitusjonFaktaPanelDef';
import OpplaeringFaktaPanelDef from './faktaPaneler/OpplaeringFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new OmBarnetFaktaPanelDef(),
  new ArbeidsforholdFaktaPanelDef(),
  new InstitusjonFaktaPanelDef(),
  new DirekteOvergangFaktaPanelDef(),
  new OmsorgenForFaktaPanelDef(),
  new MedisinskVilkarFaktaPanelDef2(),
  new OpplaeringFaktaPanelDef(),
  new EtablertTilsynFaktaPanelDef(),
  new MedlemskapsvilkaretFaktaPanelDef(),
  new OpptjeningsvilkaretFaktaPanelDef(),
  new InntektsmeldingFaktaPanelDef(),
  new OverstyrBeregningFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
  new FordelBeregningPanelDef(),
  new InntektOgYtelserFaktaPanelDef(),
  new UtenlandsoppholdFaktaPanelDef(),
  new SoknadsperioderFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
