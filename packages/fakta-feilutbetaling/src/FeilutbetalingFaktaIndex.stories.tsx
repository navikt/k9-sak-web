import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import alleKodeverkTilbakeV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkTilbakeV2.json';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import FeilutbetalingFaktaIndex from './FeilutbetalingFaktaIndex';

const behandling = {
  id: 1,
  versjon: 1,
};

const feilutbetalingFakta = {
  behandlingFakta: {
    perioder: [
      {
        fom: '2018-01-01',
        tom: '2019-01-01',
        belop: 1000,
      },
    ],
    totalPeriodeFom: '2019-01-01',
    totalPeriodeTom: '2019-01-02',
    aktuellFeilUtbetaltBeløp: 10000,
    tidligereVarseltBeløp: 5000,
    behandlingÅrsaker: [
      {
        behandlingArsakType: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
      },
    ],
    behandlingsresultat: {
      type: behandlingResultatType.INNVILGET,
      konsekvenserForYtelsen: [konsekvensForYtelsen.YTELSE_OPPHØRER, konsekvensForYtelsen.ENDRING_I_BEREGNING],
    },
    tilbakekrevingValg: {
      videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
    },
    datoForRevurderingsvedtak: '2019-01-01',
  },
};

const feilutbetalingAarsak = {
  hendelseTyper: [
    {
      hendelseType: 'OPPTJENING', // navn: '§14-6 Opptjening'
      hendelseUndertyper: [],
    },
    {
      hendelseType: 'ANNET', // navn: 'Annet'
      hendelseUndertyper: [],
    },
    {
      hendelseType: 'MEDLEM', // navn: '§14-2 Medlemskap'
      hendelseUndertyper: [
        'IKKE_EØS', // navn: 'Ikke oppholdsrett EØS'
        'IKKE_BOSATT', // navn: 'Ikke bosatt'
      ],
    },
  ],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/tilbakekreving/fakta-feilutbetaling',
  component: FeilutbetalingFaktaIndex,
};

export const visAksjonspunktForFeilutbetaling = args => (
  <KodeverkProvider
    behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={alleKodeverkV2}
    tilbakeKodeverk={alleKodeverkTilbakeV2}
  >
    <FeilutbetalingFaktaIndex
      behandling={behandling}
      aksjonspunkter={[
        {
          definisjon: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING,
          status: aksjonspunktStatus.OPPRETTET,
          begrunnelse: undefined,
          kanLoses: true,
          erAktivt: true,
        },
      ]}
      submitCallback={action('button-click')}
      {...args}
    />
  </KodeverkProvider>
);

visAksjonspunktForFeilutbetaling.args = {
  feilutbetalingFakta,
  feilutbetalingAarsak,
  alleMerknaderFraBeslutter: {
    [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING]: merknaderFraBeslutter,
  },
  readOnly: false,
  hasOpenAksjonspunkter: true,
};
