import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import OpplysningerFraSoknadenIndex from '@fpsak-frontend/fakta-opplysninger-fra-soknaden';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import * as React from 'react';
import frisinnBehandlingApi from '../data/frisinnBehandlingApi';

const faktaPanelDefinisjoner: FaktaPanelDefinisjon[] = [
  {
    urlCode: faktaPanelCodes.INNTEKT_OG_YTELSER,
    textCode: 'InntektOgYtelser.Title',
    aksjonspunkterCodes: [],
    endpoints: [frisinnBehandlingApi.INNTEKT_OG_YTELSER],
    renderComponent: props => <InntektOgYtelser {...props} />,
    showComponent: ({ personopplysninger }) => personopplysninger,
    getData: () => ({}),
  },
  {
    urlCode: faktaPanelCodes.OPPLYSNINGER_FRA_SØKNADEN,
    textCode: 'OpplysningerFraSoknaden.Title',
    aksjonspunkterCodes: [aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING_KODE],
    endpoints: [],
    renderComponent: props => <OpplysningerFraSoknadenIndex {...props} />,
    showComponent: () => true,
    getData: () => ({}),
  },
];

export default faktaPanelDefinisjoner;
