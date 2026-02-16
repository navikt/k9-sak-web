import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';
import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import OpplysningerFraSoknadFaktaPanelDef from './faktaPaneler/OpplysningerFraSoknadFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new InntektOgYtelserFaktaPanelDef(),
  new OpplysningerFraSoknadFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
