import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import withReduxProvider from '../../../decorators/withRedux';

export default {
  title: 'fakta/pleiepenger/fakta-soknadsperioder',
  component: SoknadsperioderIndex,
  decorators: [withKnobs, withReduxProvider],
};

const data = {
  perioderMedÅrsak: {
    perioderTilVurdering: [
      { fom: '2021-12-31', tom: '2021-12-31' },
      { fom: '2021-12-02', tom: '2021-12-29' },
    ],
    perioderMedÅrsak: [
      { periode: { fom: '2021-12-02', tom: '2021-12-13' }, årsaker: ['REVURDERER_BERØRT_PERIODE'] },
      {
        periode: { fom: '2021-12-14', tom: '2021-12-14' },
        årsaker: ['ENDRING_FRA_BRUKER', 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON'],
      },
      { periode: { fom: '2021-12-15', tom: '2021-12-29' }, årsaker: ['REVURDERER_BERØRT_PERIODE'] },
      { periode: { fom: '2021-12-31', tom: '2021-12-31' }, årsaker: ['FØRSTEGANGSVURDERING'] },
      {
        periode: { fom: '2022-01-01', tom: '2022-01-02' },
        årsaker: ['REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON'],
      },
      {
        periode: { fom: '2022-01-03', tom: '2022-01-31' },
        årsaker: [
          'REVURDERER_NATTEVÅKBEREDSKAP_ENDRING_FRA_ANNEN_OMSORGSPERSON',
          'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        ],
      },
    ],
    dokumenterTilBehandling: [
      {
        journalpostId: '524978131',
        innsendingsTidspunkt: '2022-02-01T16:37:00',
        type: 'SØKNAD',
        søktePerioder: [
          {
            periode: { fom: '2021-12-14', tom: '2021-12-14' },
            type: null,
            arbeidsgiver: null,
            arbeidsforholdRef: null,
          },
          {
            periode: { fom: '2021-12-31', tom: '2021-12-31' },
            type: null,
            arbeidsgiver: null,
            arbeidsforholdRef: null,
          },
        ],
      },
    ],
  },
  periodeMedUtfall: [
    { periode: { fom: '2021-12-02', tom: '2021-12-29' }, utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' } },
    { periode: { fom: '2021-12-31', tom: '2021-12-31' }, utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' } },
  ],
  forrigeVedtak: [
    { periode: { fom: '2021-12-02', tom: '2021-12-29' }, utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' } },
  ],
};

export const visFaktaOmSøknadsperioder = () => <SoknadsperioderIndex behandlingPerioderårsakMedVilkår={data} />;
