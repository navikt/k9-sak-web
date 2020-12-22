import FeatureToggles from "@k9-sak-web/types/src/featureTogglesTsType";
import ArbeidsforholdFaktaPanelDef from './faktaPaneler/ArbeidsforholdFaktaPanelDef';
import VergeFaktaPanelDef from './faktaPaneler/VergeFaktaPanelDef';
import MedlemskapsvilkaretFaktaPanelDef from './faktaPaneler/MedlemskapsvilkaretFaktaPanelDef';
import OpptjeningsvilkaretFaktaPanelDef from './faktaPaneler/OpptjeningsvilkaretFaktaPanelDef';
import FordelBeregningPanelDef from './faktaPaneler/FordelBeregningPanelDef';
import UttakFaktaPanelDef from './faktaPaneler/UttakFaktaPanelDef';
import BarnFaktaPanelDef from './faktaPaneler/BarnFaktaPanelDef';
import NøkkeltallFaktaPanelDef from './faktaPaneler/NøkkeltallFaktaPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';

const faktaPanelDefinisjoner = (featureToggles: FeatureToggles) => {

  const paneler = [
    new ArbeidsforholdFaktaPanelDef(),
    new VergeFaktaPanelDef(),
    new MedlemskapsvilkaretFaktaPanelDef(),
    new OpptjeningsvilkaretFaktaPanelDef(),
    new UttakFaktaPanelDef(),
    new BarnFaktaPanelDef(),
    new FordelBeregningPanelDef(),
  ];

  if (!featureToggles?.PERIODISERTE_NOKKELTALL) paneler.push(new NøkkeltallFaktaPanelDef());

  paneler.push(new InntektOgYtelserFaktaPanelDef());

  return paneler;
};

export default faktaPanelDefinisjoner;
