import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import * as React from 'react';
import frisinnBehandlingApi from '../data/frisinnBehandlingApi';

const faktaPanelDefinisjoner: FaktaPanelDefinisjon[] = [
  {
    urlCode: faktaPanelCodes.INNTEKT,
    textCode: 'InntektOgYtelser.Title',
    aksjonspunkterCodes: [],
    endpoints: [frisinnBehandlingApi.INNTEKT],
    renderComponent: props => <InntektOgYtelser {...props} />,
    showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
    getData: () => ({}),
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
