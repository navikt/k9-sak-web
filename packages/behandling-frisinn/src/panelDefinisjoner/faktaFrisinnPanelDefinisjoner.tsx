import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import * as React from 'react';

const faktaPanelDefinisjoner: FaktaPanelDefinisjon[] = [
  {
    urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
    textCode: 'ArbeidsforholdInfoPanel.Title',
    aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
    endpoints: [],
    renderComponent: props => <ArbeidsforholdFaktaIndex {...props} />,
    showComponent: ({ personopplysninger }) => personopplysninger,
    getData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
  },
  {
    urlCode: faktaPanelCodes.BEREGNING,
    textCode: 'BeregningInfoPanel.Title',
    aksjonspunkterCodes: [
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
      aksjonspunktCodes.AVKLAR_AKTIVITETER,
      aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
      aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
    ],
    endpoints: [],
    renderComponent: props => <BeregningFaktaIndex {...props} />,
    showComponent: ({ beregningsgrunnlag }) => beregningsgrunnlag,
    getData: ({ rettigheter, beregningsgrunnlag }) => ({
      erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
      beregningsgrunnlag,
    }),
  },
];

export default faktaPanelDefinisjoner;
