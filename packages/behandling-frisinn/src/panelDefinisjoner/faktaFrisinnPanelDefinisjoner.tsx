import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import * as React from 'react';
import frisinnBehandlingApi from '../data/frisinnBehandlingApi';

const faktaPanelDefinisjoner: FaktaPanelDefinisjon[] = [
  {
    urlCode: faktaPanelCodes.INNTEKT_OG_YTELSER,
    textCode: 'InntektOgYtelser.Title',
    aksjonspunkterCodes: [],
    endpoints: [frisinnBehandlingApi.INNTEKT_OG_YTELSER],
    renderComponent: props => <InntektOgYtelser {...props} />,
    showComponent: ({ personopplysninger, soknad }) => personopplysninger && soknad,
    getData: () => ({}),
  },
];

export default faktaPanelDefinisjoner;
