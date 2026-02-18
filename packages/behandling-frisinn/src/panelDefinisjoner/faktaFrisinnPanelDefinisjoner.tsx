import InntektOgYtelserFaktaPanelDef from './faktaPaneler/InntektOgYtelserFaktaPanelDef';
import OpplysningerFraSoknadFaktaPanelDef from './faktaPaneler/OpplysningerFraSoknadFaktaPanelDef';
import BeregningFaktaPanelDef from './faktaPaneler/BeregningFaktaPanelDef';

const faktaPanelDefinisjoner = [
  new InntektOgYtelserFaktaPanelDef(),
  new OpplysningerFraSoknadFaktaPanelDef(),
  new BeregningFaktaPanelDef(),
];

export default faktaPanelDefinisjoner;
