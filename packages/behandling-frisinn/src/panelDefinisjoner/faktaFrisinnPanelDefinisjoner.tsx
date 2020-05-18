import FaktaPanelDefinisjon from '@fpsak-frontend/behandling-felles/src/types/faktaPanelDefinisjonTsType';
import InntektOgYtelser from '@fpsak-frontend/fakta-inntekt-og-ytelser';
import OpplysningerFraSoknadenIndex from '@fpsak-frontend/fakta-opplysninger-fra-soknaden';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import * as React from 'react';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
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
    aksjonspunkterCodes: [aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING],
    endpoints: [frisinnBehandlingApi.OPPGITT_OPPTJENING],
    renderComponent: ({ navAnsatt: { kanSaksbehandle }, behandling, ...otherProps }) => {
      const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status.kode;
      const kanEndrePåSøknadsopplysninger = kanSaksbehandle && !behandlingenErAvsluttet;
      return (
        <OpplysningerFraSoknadenIndex
          {...otherProps}
          kanEndrePåSøknadsopplysninger={kanEndrePåSøknadsopplysninger}
          behandling={behandling}
        />
      );
    },
    showComponent: () => true,
    getData: () => ({}),
  },
  {
    urlCode: faktaPanelCodes.BEREGNING,
    textCode: 'BeregningInfoPanel.Title',
    aksjonspunkterCodes: [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN],
    endpoints: [],
    renderComponent: props => <BeregningFaktaIndex {...props} />,
    showComponent: () => true,
    getData: ({ beregningsgrunnlag }) => ({
      erOverstyrer: false,
      beregningsgrunnlag,
    }),
  },
];

export default faktaPanelDefinisjoner;
