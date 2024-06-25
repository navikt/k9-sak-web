import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { action } from '@storybook/addon-actions';
import React from 'react';
import FeilutbetalingFaktaIndex from './FeilutbetalingFaktaIndex';

const BEHANDLING_AARSAK_KODEVERK = 'BEHANDLING_AARSAK';
const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';
const BEHANDLING_RESULTAT_TYPE_KODEVERK = 'BEHANDLING_RESULTAT_TYPE';
const KONSEKVENS_FOR_YTELSEN_KODEVERK = 'KONSEKVENS_FOR_YTELSEN';

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
      konsekvenserForYtelsen: [konsekvensForYtelsen.FORELDREPENGER_OPPHØRER, konsekvensForYtelsen.ENDRING_I_BEREGNING],
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
      hendelseType: {
        kode: 'OPPTJENING',
        navn: '§14-6 Opptjening',
      },
      hendelseUndertyper: [],
    },
    {
      hendelseType: {
        kode: 'ANNET',
        navn: 'Annet',
      },
      hendelseUndertyper: [],
    },
    {
      hendelseType: {
        kode: 'MEDLEM',
        navn: '§14-2 Medlemskap',
      },
      hendelseUndertyper: [
        {
          kode: 'IKKE_EØS',
          navn: 'Ikke oppholdsrett EØS',
        },
        {
          kode: 'IKKE_BOSATT',
          navn: 'Ikke bosatt',
        },
      ],
    },
  ],
};

const alleKodeverk = {
  [kodeverkTyper.BEHANDLING_AARSAK]: [
    {
      kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
      navn: 'Feil i lovanvendelse',
      kodeverk: BEHANDLING_AARSAK_KODEVERK,
    },
  ],
  [kodeverkTyper.TILBAKEKR_VIDERE_BEH]: [
    {
      kode: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
      navn: 'Tilbakekreving inntrekk',
      kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
    },
  ],
  [kodeverkTyper.BEHANDLING_RESULTAT_TYPE]: [
    {
      kode: behandlingResultatType.INNVILGET,
      navn: 'Innvilget',
      kodeverk: BEHANDLING_RESULTAT_TYPE_KODEVERK,
    },
  ],
  [kodeverkTyper.KONSEKVENS_FOR_YTELSEN]: [
    {
      kode: konsekvensForYtelsen.FORELDREPENGER_OPPHØRER,
      navn: 'Foreldrepenger opphører',
      kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
    },
    {
      kode: konsekvensForYtelsen.ENDRING_I_BEREGNING,
      navn: 'Endring i beregning',
      kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
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
    alleKodeverk={alleKodeverk}
    fpsakKodeverk={alleKodeverk}
    submitCallback={action('button-click')}
    {...args}
  />
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
